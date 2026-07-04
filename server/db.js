const fs   = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

const defaultDB = {
  users:    [],   // { id, name, email, passwordHash, plan, createdAt }
  clients:  [],   // { id, userId, name, email, phone, program, stage, notes, createdAt }
  sessions: [],   // { id, userId, clientId, date, time, type, goal, status, aiSummary }
  programs: [],   // { id, userId, name, price, ... }
  tasks:    [],   // { id, userId, text, done, due }
  toolRuns: []    // { id, userId, clientId, toolId, inputs, aiOutput, createdAt } — historial de herramientas usadas
};

function loadDB() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_FILE)) { saveDB(defaultDB); return structuredClone(defaultDB); }
    const raw = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    // Asegurar que todas las colecciones existan (migración suave)
    return { ...structuredClone(defaultDB), ...raw };
  } catch (e) {
    console.error('DB load error', e);
    return structuredClone(defaultDB);
  }
}

function saveDB(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) { console.error('DB write error', e); }
}

function nextId(arr) {
  return arr.length === 0 ? 1 : Math.max(...arr.map(x => x.id || 0)) + 1;
}

// ── LÍMITES POR PLAN ──
const PLAN_LIMITS = {
  starter: { maxClients: 3,       maxToolsPerMonth: 20,       toolsUnlocked: 10, programs: false, payments: false, whiteLabel: false },
  pro:     { maxClients: 999999,  maxToolsPerMonth: 999999,   toolsUnlocked: 60, programs: true,  payments: true,  whiteLabel: false },
  elite:   { maxClients: 999999,  maxToolsPerMonth: 999999,   toolsUnlocked: 60, programs: true,  payments: true,  whiteLabel: true  }
};

module.exports = { loadDB, saveDB, nextId, PLAN_LIMITS };
