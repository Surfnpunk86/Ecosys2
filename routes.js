const express = require('express');
const router  = express.Router();
const { loadDB, saveDB, nextId, PLAN_LIMITS } = require('./db');
const { TOOLS } = require('./tools-catalog');

// Todas las rutas aquí ya pasan por requireAuth en index.js,
// así que req.user siempre está disponible (id, email, name, plan).

function myLimits(req) {
  return PLAN_LIMITS[req.user.plan] || PLAN_LIMITS.starter;
}

// ═══════════════════ CLIENTES ═══════════════════
router.get('/clients', (req, res) => {
  const db = loadDB();
  const clients = db.clients.filter(c => c.userId === req.user.id);
  res.json(clients);
});

router.post('/clients', (req, res) => {
  const db = loadDB();
  const limits = myLimits(req);
  const mine = db.clients.filter(c => c.userId === req.user.id);

  if (mine.length >= limits.clients) {
    return res.status(403).json({
      error: `Tu plan permite hasta ${limits.clients} cliente(s).`,
      upgradeRequired: true
    });
  }

  const { name, email, phone, stage, program, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nombre y email son requeridos' });

  const client = {
    id: nextId(db.clients),
    userId: req.user.id,
    name, email,
    phone: phone || '',
    stage: stage || 'SER',
    program: program || '',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  db.clients.push(client);
  saveDB(db);
  res.json(client);
});

router.delete('/clients/:id', (req, res) => {
  const db = loadDB();
  const id = Number(req.params.id);
  const before = db.clients.length;
  db.clients = db.clients.filter(c => !(c.id === id && c.userId === req.user.id));
  if (db.clients.length === before) return res.status(404).json({ error: 'Cliente no encontrado' });
  // Limpieza opcional: también se podrían borrar sesiones/tool-runs asociadas
  saveDB(db);
  res.json({ ok: true });
});

// ═══════════════════ SESIONES ═══════════════════
router.get('/sessions', (req, res) => {
  const db = loadDB();
  const sessions = db.sessions.filter(s => s.userId === req.user.id);
  res.json(sessions);
});

router.post('/sessions', (req, res) => {
  const db = loadDB();
  const { clientId, date, time, type, goal } = req.body;
  if (!clientId || !date) return res.status(400).json({ error: 'Cliente y fecha son requeridos' });

  const id = nextId(db.sessions);
  const session = {
    id,
    userId: req.user.id,
    clientId: Number(clientId),
    date,
    time: time || '09:00',
    type: type || 'Individual 1:1',
    goal: goal || '',
    status: 'scheduled',
    meetLink: `https://meet.jit.si/ecosys-sesion-${id}`,
    createdAt: new Date().toISOString()
  };
  db.sessions.push(session);
  saveDB(db);
  res.json(session);
});

router.put('/sessions/:id', (req, res) => {
  const db = loadDB();
  const id = Number(req.params.id);
  const idx = db.sessions.findIndex(s => s.id === id && s.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Sesión no encontrada' });

  db.sessions[idx] = { ...db.sessions[idx], ...req.body };
  saveDB(db);
  res.json(db.sessions[idx]);
});

// ═══════════════════ PROGRAMAS ═══════════════════
router.get('/programs', (req, res) => {
  const limits = myLimits(req);
  if (!limits.programs) return res.status(403).json({ error: 'Los programas requieren plan Pro o Elite', upgradeRequired: true });

  const db = loadDB();
  const programs = db.programs.filter(p => p.userId === req.user.id);
  res.json(programs);
});

router.post('/programs', (req, res) => {
  const limits = myLimits(req);
  if (!limits.programs) return res.status(403).json({ error: 'Los programas requieren plan Pro o Elite', upgradeRequired: true });

  const db = loadDB();
  const { name, price, duration, description, currency } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Nombre y precio son requeridos' });

  const program = {
    id: nextId(db.programs),
    userId: req.user.id,
    name,
    price: Number(price),
    duration: duration || '',
    description: description || '',
    currency: currency || 'USD',
    enrollments: 0,
    createdAt: new Date().toISOString()
  };
  db.programs.push(program);
  saveDB(db);
  res.json(program);
});

router.delete('/programs/:id', (req, res) => {
  const db = loadDB();
  const id = Number(req.params.id);
  const before = db.programs.length;
  db.programs = db.programs.filter(p => !(p.id === id && p.userId === req.user.id));
  if (db.programs.length === before) return res.status(404).json({ error: 'Programa no encontrado' });
  saveDB(db);
  res.json({ ok: true });
});

// ═══════════════════ HERRAMIENTAS ═══════════════════
router.get('/tools', (req, res) => {
  const limits = myLimits(req);
  const unlocked = limits.toolsUnlocked >= TOOLS.length ? TOOLS.length : limits.toolsUnlocked;
  const tools = TOOLS.map((t, i) => ({ ...t, locked: i >= unlocked }));
  res.json(tools);
});

router.post('/tool-runs', (req, res) => {
  const db = loadDB();
  const { clientId, toolId, inputs, aiOutput } = req.body;
  const run = {
    id: nextId(db.toolRuns),
    userId: req.user.id,
    clientId: clientId ? Number(clientId) : null,
    toolId,
    inputs: inputs || {},
    aiOutput: aiOutput || '',
    createdAt: new Date().toISOString()
  };
  db.toolRuns.push(run);
  saveDB(db);
  res.json(run);
});

// ═══════════════════ ANALYTICS ═══════════════════
router.get('/analytics', (req, res) => {
  const db = loadDB();
  const clients  = db.clients.filter(c => c.userId === req.user.id);
  const sessions = db.sessions.filter(s => s.userId === req.user.id);
  const programs = db.programs.filter(p => p.userId === req.user.id);

  const now = new Date();
  const sessionsThisMonth = sessions.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const completed = sessions.filter(s => s.status === 'completed').length;
  const attendanceRate = sessions.length > 0 ? Math.round((completed / sessions.length) * 100) : 0;

  const stageDistribution = { SER: 0, HACER: 0, TENER: 0, DAR: 0, RECIBIR: 0 };
  clients.forEach(c => { if (stageDistribution[c.stage] !== undefined) stageDistribution[c.stage]++; });

  res.json({
    totalClients: clients.length,
    sessionsThisMonth,
    attendanceRate,
    avgNPS: null,
    totalPrograms: programs.length,
    stageDistribution
  });
});

module.exports = router;
