const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const router  = express.Router();
const { loadDB, saveDB, nextId, PLAN_LIMITS } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, plan: user.plan },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// ── REGISTRO ──
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
    }
    const validPlans = ['starter', 'pro', 'elite'];
    const finalPlan = validPlans.includes(plan) ? plan : 'starter';

    const db = loadDB();
    const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(409).json({ error: 'Ya existe una cuenta con este email. Inicia sesión.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = {
      id: nextId(db.users),
      name, email: email.toLowerCase(),
      passwordHash,
      plan: finalPlan,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    saveDB(db);

    const token = signToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      limits: PLAN_LIMITS[user.plan]
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error interno al crear la cuenta' });
  }
});

// ── LOGIN ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

    const db = loadDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      limits: PLAN_LIMITS[user.plan]
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── VERIFICAR TOKEN ──
router.get('/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const db = loadDB();
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    res.json({
      valid: true,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      limits: PLAN_LIMITS[user.plan]
    });
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// ── ACTUALIZAR PLAN (simula upgrade — en producción esto lo dispara el webhook de pago) ──
router.post('/upgrade', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const { plan } = req.body;
    if (!['starter','pro','elite'].includes(plan)) return res.status(400).json({ error: 'Plan inválido' });

    const db = loadDB();
    const idx = db.users.findIndex(u => u.id === decoded.id);
    if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    db.users[idx].plan = plan;
    saveDB(db);

    const token = signToken(db.users[idx]);
    res.json({ token, user: { id: db.users[idx].id, name: db.users[idx].name, email: db.users[idx].email, plan }, limits: PLAN_LIMITS[plan] });
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = { router, JWT_SECRET };
