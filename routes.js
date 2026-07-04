const express = require('express');
const router  = express.Router();
const { loadDB, saveDB, nextId, PLAN_LIMITS } = require('./db');
const { TOOLS } = require('./tools-catalog');

// req.user viene inyectado por el middleware requireAuth en index.js

function getLimits(user) {
  return PLAN_LIMITS[user.plan] || PLAN_LIMITS.starter;
}

// ══════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════
router.get('/clients', (req, res) => {
  const db = loadDB();
  const list = db.clients.filter(c => c.userId === req.user.id);
  res.json(list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.post('/clients', (req, res) => {
  const db = loadDB();
  const limits = getLimits(req.user);
  const currentCount = db.clients.filter(c => c.userId === req.user.id).length;

  if (currentCount >= limits.maxClients) {
    return res.status(403).json({
      error: `Tu plan permite hasta ${limits.maxClients} clientes. Actualiza tu plan para agregar más.`,
      upgradeRequired: true
    });
  }

  const { name, email, phone, program, stage, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nombre y email requeridos' });

  const client = {
    id: nextId(db.clients),
    userId: req.user.id,
    name, email,
    phone: phone || '', program: program || '', stage: stage || 'SER',
    notes: notes || '', nps: null,
    createdAt: new Date().toISOString()
  };
  db.clients.push(client);
  saveDB(db);
  res.json(client);
});

router.put('/clients/:id', (req, res) => {
  const db = loadDB();
  const idx = db.clients.findIndex(c => c.id === +req.params.id && c.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Cliente no encontrado' });
  db.clients[idx] = { ...db.clients[idx], ...req.body, id: +req.params.id, userId: req.user.id };
  saveDB(db);
  res.json(db.clients[idx]);
});

router.delete('/clients/:id', (req, res) => {
  const db = loadDB();
  db.clients = db.clients.filter(c => !(c.id === +req.params.id && c.userId === req.user.id));
  saveDB(db);
  res.json({ ok: true });
});

// ══════════════════════════════════════════
// SESIONES
// ══════════════════════════════════════════
router.get('/sessions', (req, res) => {
  const db = loadDB();
  let list = db.sessions.filter(s => s.userId === req.user.id);
  if (req.query.clientId) list = list.filter(s => s.clientId === +req.query.clientId);
  res.json(list.sort((a,b) => new Date(a.date) - new Date(b.date)));
});

router.post('/sessions', (req, res) => {
  const db = loadDB();
  const { clientId, date, time, type, goal, tool } = req.body;
  if (!clientId || !date) return res.status(400).json({ error: 'Cliente y fecha requeridos' });

  const client = db.clients.find(c => c.id === +clientId && c.userId === req.user.id);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });

  // Generar link de Google Meet instantáneo (no requiere API — es un link genérico de nueva reunión)
  const meetLink = `https://meet.google.com/new`;

  const session = {
    id: nextId(db.sessions),
    userId: req.user.id,
    clientId: +clientId,
    date, time: time || '09:00',
    type: type || 'Individual 1:1',
    goal: goal || '', tool: tool || '',
    meetLink,
    status: 'scheduled', notes: '', aiSummary: '',
    createdAt: new Date().toISOString()
  };
  db.sessions.push(session);
  saveDB(db);
  res.json(session);
});

router.put('/sessions/:id', (req, res) => {
  const db = loadDB();
  const idx = db.sessions.findIndex(s => s.id === +req.params.id && s.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Sesión no encontrada' });
  db.sessions[idx] = { ...db.sessions[idx], ...req.body, id: +req.params.id, userId: req.user.id };
  saveDB(db);
  res.json(db.sessions[idx]);
});

router.delete('/sessions/:id', (req, res) => {
  const db = loadDB();
  db.sessions = db.sessions.filter(s => !(s.id === +req.params.id && s.userId === req.user.id));
  saveDB(db);
  res.json({ ok: true });
});

// ══════════════════════════════════════════
// PROGRAMAS (solo Pro y Elite)
// ══════════════════════════════════════════
router.get('/programs', (req, res) => {
  const db = loadDB();
  res.json(db.programs.filter(p => p.userId === req.user.id)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.post('/programs', (req, res) => {
  const limits = getLimits(req.user);
  if (!limits.programs) {
    return res.status(403).json({ error: 'Los programas requieren plan Pro o Elite.', upgradeRequired: true });
  }
  const db = loadDB();
  const { name, description, duration, sessions, price, currency } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Nombre y precio requeridos' });

  const program = {
    id: nextId(db.programs), userId: req.user.id,
    name, description: description || '', duration: duration || '',
    sessions: sessions || 0, price: +price, currency: currency || 'USD',
    enrollments: 0, status: 'active',
    createdAt: new Date().toISOString()
  };
  db.programs.push(program);
  saveDB(db);
  res.json(program);
});

router.put('/programs/:id', (req, res) => {
  const db = loadDB();
  const idx = db.programs.findIndex(p => p.id === +req.params.id && p.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Programa no encontrado' });
  db.programs[idx] = { ...db.programs[idx], ...req.body, id: +req.params.id, userId: req.user.id };
  saveDB(db);
  res.json(db.programs[idx]);
});

router.delete('/programs/:id', (req, res) => {
  const db = loadDB();
  db.programs = db.programs.filter(p => !(p.id === +req.params.id && p.userId === req.user.id));
  saveDB(db);
  res.json({ ok: true });
});

// ══════════════════════════════════════════
// TAREAS
// ══════════════════════════════════════════
router.get('/tasks', (req, res) => {
  const db = loadDB();
  res.json(db.tasks.filter(t => t.userId === req.user.id));
});

router.post('/tasks', (req, res) => {
  const db = loadDB();
  const task = {
    id: nextId(db.tasks), userId: req.user.id,
    text: req.body.text || '', done: false, due: req.body.due || null,
    createdAt: new Date().toISOString()
  };
  db.tasks.push(task);
  saveDB(db);
  res.json(task);
});

router.put('/tasks/:id', (req, res) => {
  const db = loadDB();
  const idx = db.tasks.findIndex(t => t.id === +req.params.id && t.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body, id: +req.params.id, userId: req.user.id };
  saveDB(db);
  res.json(db.tasks[idx]);
});

router.delete('/tasks/:id', (req, res) => {
  const db = loadDB();
  db.tasks = db.tasks.filter(t => !(t.id === +req.params.id && t.userId === req.user.id));
  saveDB(db);
  res.json({ ok: true });
});

// ══════════════════════════════════════════
// CATÁLOGO DE HERRAMIENTAS
// ══════════════════════════════════════════
router.get('/tools', (req, res) => {
  const limits = getLimits(req.user);
  const unlocked = limits.toolsUnlocked;
  // Marcar cuáles están bloqueadas según el plan
  const tools = TOOLS.map((t, i) => ({ ...t, locked: i >= unlocked }));
  res.json(tools);
});

router.get('/tools/:toolId', (req, res) => {
  const tool = TOOLS.find(t => t.id === req.params.toolId);
  if (!tool) return res.status(404).json({ error: 'Herramienta no encontrada' });
  const limits = getLimits(req.user);
  const idx = TOOLS.findIndex(t => t.id === req.params.toolId);
  if (idx >= limits.toolsUnlocked) {
    return res.status(403).json({ error: 'Esta herramienta requiere plan Pro o Elite.', upgradeRequired: true });
  }
  res.json(tool);
});

// Historial de uso de herramientas por cliente
router.get('/tool-runs', (req, res) => {
  const db = loadDB();
  let list = db.toolRuns.filter(r => r.userId === req.user.id);
  if (req.query.clientId) list = list.filter(r => r.clientId === +req.query.clientId);
  res.json(list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.post('/tool-runs', (req, res) => {
  const db = loadDB();
  const run = {
    id: nextId(db.toolRuns), userId: req.user.id,
    clientId: req.body.clientId || null,
    toolId: req.body.toolId,
    inputs: req.body.inputs || {},
    aiOutput: req.body.aiOutput || '',
    createdAt: new Date().toISOString()
  };
  db.toolRuns.push(run);
  saveDB(db);
  res.json(run);
});

// ══════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════
router.get('/analytics', (req, res) => {
  const db = loadDB();
  const clients  = db.clients.filter(c => c.userId === req.user.id);
  const sessions = db.sessions.filter(s => s.userId === req.user.id);
  const programs = db.programs.filter(p => p.userId === req.user.id);

  const now = new Date();
  const thisMonth = now.toISOString().slice(0,7);
  const sessionsThisMonth = sessions.filter(s => (s.date||'').startsWith(thisMonth));
  const completed = sessions.filter(s => s.status === 'completed');
  const attendanceRate = sessions.length ? Math.round((completed.length/sessions.length)*100) : 0;

  const stageCount = { SER:0, HACER:0, TENER:0, DAR:0, RECIBIR:0 };
  clients.forEach(c => { if (stageCount[c.stage] !== undefined) stageCount[c.stage]++; });

  const revenue = programs.reduce((acc,p) => acc + (p.price * p.enrollments), 0);
  const npsClients = clients.filter(c => c.nps);
  const avgNPS = npsClients.length ? (npsClients.reduce((a,c)=>a+c.nps,0)/npsClients.length).toFixed(1) : null;

  res.json({
    totalClients: clients.length,
    sessionsThisMonth: sessionsThisMonth.length,
    totalPrograms: programs.length,
    attendanceRate,
    stageDistribution: stageCount,
    totalRevenue: revenue,
    avgNPS
  });
});

module.exports = router;
