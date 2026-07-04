require('dotenv').config();
const express   = require('express');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt       = require('jsonwebtoken');
const fetch     = require('node-fetch');
const path      = require('path');

const { router: authRouter, JWT_SECRET } = require('./auth');
const dataRoutes = require('./routes');
const { TOOLS }   = require('./tools-catalog');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// ── RATE LIMITING ──
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 20,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' } });
const aiLimiter = rateLimit({ windowMs: 60*1000, max: 30,
  message: { error: 'Límite de IA alcanzado. Espera un momento.' } });

// ── MIDDLEWARE AUTH ──
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Token inválido o expirado' }); }
}

// ── HEALTH ──
app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

// ── AUTH (público) ──
app.use('/api/auth', authLimiter, authRouter);

// ── DATOS (protegido) ──
app.use('/api/data', requireAuth, dataRoutes);

// ── IA ──
async function callAnthropic(messages, system, maxTokens = 1024) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: maxTokens, system, messages })
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Anthropic ${r.status}: ${txt.slice(0,200)}`);
  }
  const d = await r.json();
  return d.content?.[0]?.text || '';
}

app.post('/api/ai/chat', requireAuth, aiLimiter, async (req, res) => {
  try {
    const { messages, system } = req.body;
    const text = await callAnthropic(
      (messages||[]).slice(-20),
      system || `Eres el asistente IA de ECOSYS para coaches. El coach se llama ${req.user.name}. Responde en español, directo y sin clichés.`
    );
    res.json({ content: text });
  } catch (e) { res.status(502).json({ error: 'Error de IA: ' + e.message }); }
});

app.post('/api/ai/content', requireAuth, aiLimiter, async (req, res) => {
  try {
    const { type, topic } = req.body;
    const text = await callAnthropic(
      [{ role:'user', content:`Crea un ${type} sobre: "${topic}". Estilo directo, auténtico, sin clichés motivacionales.` }],
      'Eres experto en contenido para coaches. Español, concreto, poderoso.'
    );
    res.json({ content: text });
  } catch (e) { res.status(502).json({ error: e.message }); }
});

app.post('/api/ai/session-notes', requireAuth, aiLimiter, async (req, res) => {
  try {
    const text = await callAnthropic(
      [{ role:'user', content:`Procesa estas notas de sesión de coaching:\n\n${req.body.notes}\n\nEntrega:\n1) Resumen ejecutivo\n2) Compromisos del cliente\n3) Próximos pasos\n4) 3 preguntas para la próxima sesión` }],
      'Eres experto en coaching. Español. Estructurado y accionable.'
    );
    res.json({ content: text });
  } catch (e) { res.status(502).json({ error: e.message }); }
});

// Análisis de herramienta — usa el catálogo real
app.post('/api/ai/tool-analysis', requireAuth, aiLimiter, async (req, res) => {
  try {
    const { toolId, inputs, clientName } = req.body;
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return res.status(404).json({ error: 'Herramienta no encontrada' });

    const inputsText = Object.entries(inputs || {})
      .map(([k,v]) => `${k}: ${v}`).join('\n');

    const text = await callAnthropic(
      [{ role:'user', content:
        `Herramienta: ${tool.name} (categoría ${tool.cat})\n` +
        `Cliente: ${clientName || 'el cliente'}\n\n` +
        `Respuestas del cliente:\n${inputsText}\n\n` +
        `Como coach experto, entrega:\n1) Interpretación de lo que revelan estas respuestas\n2) Patrones o contradicciones que notas\n3) 3 recomendaciones concretas\n4) 2 preguntas de reflexión poderosas para profundizar en la próxima sesión`
      }],
      `Eres un coach experto analizando resultados de "${tool.name}". Español, profundo, directo, sin clichés motivacionales baratos.`,
      1200
    );
    res.json({ content: text });
  } catch (e) { res.status(502).json({ error: e.message }); }
});

app.get('/api/ai/daily-insight', requireAuth, async (req, res) => {
  try {
    const text = await callAnthropic(
      [{ role:'user', content:'Dame UN insight poderoso para un coach hoy. Máximo 2 frases. Profundo, sin clichés.' }],
      'Coach experto. Español. Directo.', 200
    );
    res.json({ content: text });
  } catch (e) { res.status(502).json({ error: e.message }); }
});

// ── FRONTEND ──
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ ECOSYS corriendo en puerto ${PORT} | ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.ANTHROPIC_API_KEY) console.warn('⚠️  ANTHROPIC_API_KEY no configurada — IA desactivada');
  if (!process.env.JWT_SECRET) console.warn('⚠️  JWT_SECRET no configurada — usando valor de desarrollo (INSEGURO en producción)');
});
