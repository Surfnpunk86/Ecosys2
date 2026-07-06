const fs   = require('fs');
const path = require('path');

// Archivo donde se guardan los datos (usuarios, clientes, sesiones, programas...)
// NOTA: en Render, el disco es efímero por defecto — si tu servicio
// se reinicia o redeploya, este archivo se borra y pierdes los datos.
// Si necesitas persistencia real, considera:
//   - Agregar un "Persistent Disk" en Render y apuntar DB_FILE ahí, o
//   - Migrar a una base de datos real (Postgres, etc.) más adelante.
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.json');

// Límites por plan — ajusta estos valores a lo que realmente ofrezcas
const PLAN_LIMITS = {
  starter: { clients: 3,        programs: false, toolsUnlocked: 10, aiRequestsPerDay: 10  },
  pro:     { clients: Infinity, programs: true,  toolsUnlocked: 60, aiRequestsPerDay: 50  },
  elite:   { clients: Infinity, programs: true,  toolsUnlocked: 60, aiRequestsPerDay: 200 }
};

function defaultDB() {
  return { users: [], clients: [], sessions: [], programs: [], toolRuns: [] };
}

function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = defaultDB();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    // Asegura que siempre existan todas las colecciones, aunque el archivo esté incompleto
    const defaults = defaultDB();
    for (const key of Object.keys(defaults)) {
      if (!Array.isArray(parsed[key])) parsed[key] = [];
    }
    return parsed;
  } catch (err) {
    console.error('Error leyendo la base de datos, usando estado por defecto:', err.message);
    return defaultDB();
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function nextId(list) {
  if (!list || list.length === 0) return 1;
  return Math.max(...list.map(item => item.id || 0)) + 1;
}

module.exports = { loadDB, saveDB, nextId, PLAN_LIMITS };
