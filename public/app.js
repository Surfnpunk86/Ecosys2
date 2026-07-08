// ══════════════════════════════════════════
// ECOSYS — App completa, 100% conectada a backend real
// ══════════════════════════════════════════

let AUTH_TOKEN   = sessionStorage.getItem('ecosys_token') || null;
let CURRENT_USER = JSON.parse(sessionStorage.getItem('ecosys_user') || 'null');
let PLAN_LIMITS  = JSON.parse(sessionStorage.getItem('ecosys_limits') || 'null');
let SELECTED_PLAN = 'starter';

const PLAN_NAMES = { starter: 'Starter (Gratis)', pro: 'Pro', elite: 'Elite' };

// ── AUTH MODAL ──
function openAuth(mode, plan) {
  document.getElementById('auth-overlay').classList.add('open');
  switchAuth(mode);
  if (plan) selectPlan(plan);
}
function closeAuth() { document.getElementById('auth-overlay').classList.remove('open'); }
function switchAuth(mode) {
  document.getElementById('auth-login').style.display    = mode === 'login' ? 'block' : 'none';
  document.getElementById('auth-register').style.display = mode === 'register' ? 'block' : 'none';
}
function selectPlan(plan) {
  SELECTED_PLAN = plan;
  document.querySelectorAll('.plan-mini').forEach(el => el.classList.toggle('selected', el.dataset.plan === plan));
}
document.addEventListener('click', e => {
  if (e.target.id === 'auth-overlay') closeAuth();
});

function showFormError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg; el.classList.add('show');
}
function hideFormError(id) { document.getElementById(id).classList.remove('show'); }

// ── REGISTRO ──
async function doRegister() {
  hideFormError('register-error');
  const name  = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const pass  = document.getElementById('register-pass').value;

  if (!name || !email || !pass) return showFormError('register-error', 'Completa todos los campos.');
  if (pass.length < 8) return showFormError('register-error', 'La contraseña debe tener mínimo 8 caracteres.');

  const btn = document.getElementById('register-btn');
  btn.textContent = 'Creando cuenta...'; btn.disabled = true;

  // Aviso si el servidor tarda (Render "duerme" el servicio tras inactividad)
  const wakeupTimer = setTimeout(() => {
    btn.textContent = 'Despertando el servidor... espera unos segundos';
  }, 4000);

  try {
    const res  = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, plan: SELECTED_PLAN })
    });
    clearTimeout(wakeupTimer);
    const data = await res.json();
    if (!res.ok) { showFormError('register-error', data.error || 'Error al crear la cuenta'); btn.textContent = 'Crear cuenta →'; btn.disabled = false; return; }

    if (!data || !data.user || !data.token) {
      showFormError('register-error', 'El servidor no devolvió una sesión válida. Intenta de nuevo.');
      btn.textContent = 'Crear cuenta →'; btn.disabled = false;
      return;
    }

    saveSession(data);
    closeAuth();
    enterApp();
    btn.textContent = 'Crear cuenta →'; btn.disabled = false;
  } catch (err) {
    clearTimeout(wakeupTimer);
    console.error('Error en doRegister:', err);
    showFormError('register-error', 'Error de conexión: ' + err.message + '. Intenta de nuevo.');
    btn.textContent = 'Crear cuenta →'; btn.disabled = false;
  }
}

// ── LOGIN ──
async function doLogin() {
  hideFormError('login-error');
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) return showFormError('login-error', 'Ingresa tu email y contraseña.');

  const btn = document.getElementById('login-btn');
  btn.textContent = 'Ingresando...'; btn.disabled = true;

  const wakeupTimer = setTimeout(() => {
    btn.textContent = 'Despertando el servidor... espera unos segundos';
  }, 4000);

  try {
    const res  = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    clearTimeout(wakeupTimer);
    const data = await res.json();
    if (!res.ok) { showFormError('login-error', data.error || 'Credenciales incorrectas'); btn.textContent = 'Entrar al sistema →'; btn.disabled = false; return; }

    if (!data || !data.user || !data.token) {
      showFormError('login-error', 'El servidor no devolvió una sesión válida. Intenta de nuevo.');
      btn.textContent = 'Entrar al sistema →'; btn.disabled = false;
      return;
    }

    saveSession(data);
    closeAuth();
    enterApp();
    btn.textContent = 'Entrar al sistema →'; btn.disabled = false;
  } catch (err) {
    clearTimeout(wakeupTimer);
    console.error('Error en doLogin:', err);
    showFormError('login-error', 'Error de conexión: ' + err.message + '. Intenta de nuevo.');
    btn.textContent = 'Entrar al sistema →'; btn.disabled = false;
  }
}

function saveSession(data) {
  AUTH_TOKEN  = data.token;
  CURRENT_USER = data.user;
  PLAN_LIMITS  = data.limits;
  sessionStorage.setItem('ecosys_token', AUTH_TOKEN);
  sessionStorage.setItem('ecosys_user', JSON.stringify(CURRENT_USER));
  sessionStorage.setItem('ecosys_limits', JSON.stringify(PLAN_LIMITS));
}

function doLogout() {
  AUTH_TOKEN = null; CURRENT_USER = null; PLAN_LIMITS = null;
  sessionStorage.clear();
  document.getElementById('app-shell').style.display    = 'none';
  document.getElementById('landing-page').style.display = 'block';
}

async function enterApp() {
  if (!CURRENT_USER || !CURRENT_USER.name) {
    console.error('enterApp() llamado sin CURRENT_USER válido:', CURRENT_USER);
    showFormError('login-error', 'No se pudo iniciar sesión correctamente. Intenta de nuevo.');
    showFormError('register-error', 'No se pudo crear la sesión correctamente. Intenta de nuevo.');
    doLogout();
    return;
  }

  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('app-shell').style.display    = 'block';

  const parts = CURRENT_USER.name.trim().split(' ');
  document.getElementById('user-avatar').textContent = (parts[0]?.[0]||'') + (parts[1]?.[0]||'');
  document.getElementById('user-name-el').textContent = CURRENT_USER.name;
  document.getElementById('user-plan-el').textContent = PLAN_NAMES[CURRENT_USER.plan] || CURRENT_USER.plan;

  const lockProgramas = document.getElementById('lock-programas');
  lockProgramas.textContent = PLAN_LIMITS?.programs ? '' : '🔒';

  const toolsBadge = document.getElementById('tools-badge');
  toolsBadge.textContent = PLAN_LIMITS?.toolsUnlocked === 60 ? '60' : `${PLAN_LIMITS?.toolsUnlocked||10}/60`;

  goTo('dashboard', document.querySelector('.nav-item'));
}

window.addEventListener('DOMContentLoaded', async () => {
  if (AUTH_TOKEN) {
    try {
      const res = await fetch('/api/auth/verify', { headers: { Authorization: 'Bearer ' + AUTH_TOKEN } });
      if (res.ok) {
        const data = await res.json();
        CURRENT_USER = data.user; PLAN_LIMITS = data.limits;
        sessionStorage.setItem('ecosys_user', JSON.stringify(CURRENT_USER));
        sessionStorage.setItem('ecosys_limits', JSON.stringify(PLAN_LIMITS));
        enterApp();
        return;
      }
    } catch (_) {}
    sessionStorage.clear(); AUTH_TOKEN = null;
  }
  document.getElementById('login-pass')?.addEventListener('keypress', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('register-pass')?.addEventListener('keypress', e => { if (e.key === 'Enter') doRegister(); });
});

// ── API HELPER ──
async function api(endpoint, opts = {}) {
  const res = await fetch(endpoint, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + AUTH_TOKEN, ...(opts.headers||{}) }
  });
  if (res.status === 401) { doLogout(); throw new Error('Sesión expirada'); }
  const data = await res.json();
  if (!res.ok) { const err = new Error(data.error || 'Error'); err.data = data; throw err; }
  return data;
}

// ── TOAST ──
function showToast(msg, icon) {
  const t = document.getElementById('toast');
  document.getElementById('toast-icon').textContent = icon || '✓';
  document.getElementById('toast-msg').textContent = msg;
  t.style.display = 'flex';
  setTimeout(() => t.style.display = 'none', 3500);
}
function showUpgradeToast(msg) { showToast(msg + ' — Ve a "Mi Plan" para actualizar.', '🔒'); }

// ── MODALES ──
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open'); });

// ── NAVEGACIÓN ──
const TITLES = {
  dashboard:'Dashboard', 'ia-coach':'IA Asistente de Coaching', clientes:'Clientes & CRM',
  sesiones:'Sesiones & Agenda', programas:'Programas & Cursos', herramientas:'Herramientas de Coaching',
  analytics:'Analytics', plan:'Mi Plan'
};

function goTo(screen, el) {
  document.getElementById('page-title-el').textContent = TITLES[screen] || screen;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  renderScreen(screen);
}

let CLIENTS_CACHE = [];
let PROGRAMS_CACHE = [];
let TOOLS_CACHE = [];

async function renderScreen(screen) {
  const c = document.getElementById('app-content');
  c.innerHTML = '<div style="padding:60px;text-align:center;color:var(--text-3);">Cargando...</div>';
  try {
    if (screen === 'dashboard')     return renderDashboard(c);
    if (screen === 'ia-coach')      return renderIAScreen(c);
    if (screen === 'clientes')      return renderClientes(c);
    if (screen === 'sesiones')      return renderSesiones(c);
    if (screen === 'programas')     return renderProgramas(c);
    if (screen === 'herramientas')  return renderHerramientas(c);
    if (screen === 'analytics')     return renderAnalytics(c);
    if (screen === 'plan')          return renderPlanScreen(c);
  } catch (err) {
    c.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><div class="title">Error al cargar</div><div class="desc">${err.message}</div></div>`;
  }
}

// ── DASHBOARD ──
async function renderDashboard(c) {
  const [clients, sessions, analytics] = await Promise.all([
    api('/api/data/clients'), api('/api/data/sessions'), api('/api/data/analytics')
  ]);
  CLIENTS_CACHE = clients;
  const today = new Date().toISOString().slice(0,10);
  const todaySessions = sessions.filter(s => s.date === today);
  const upcoming = sessions.filter(s => s.date >= today).slice(0,4);

  c.innerHTML = `
    <div class="hero-strip">
      <div>
        <div class="hero-greeting">Hola, ${CURRENT_USER.name.split(' ')[0]} ✦</div>
        <div class="hero-sub">${todaySessions.length} sesiones hoy · ${clients.length} clientes activos</div>
      </div>
      <button class="top-btn primary" onclick="goTo('ia-coach', document.querySelectorAll('.nav-item')[1])">🤖 Consultar IA Asistente</button>
    </div>
    <div class="grid-4" style="margin-bottom:24px;">
      <div class="card card-violet"><div class="card-header"><div class="card-title">Clientes</div><div class="card-icon">👥</div></div>
        <div class="stat-value">${clients.length}</div><div class="stat-label">activos</div></div>
      <div class="card"><div class="card-header"><div class="card-title">Sesiones (total)</div><div class="card-icon">📅</div></div>
        <div class="stat-value">${sessions.length}</div><div class="stat-label">agendadas</div></div>
      <div class="card"><div class="card-header"><div class="card-title">Asistencia</div><div class="card-icon">✓</div></div>
        <div class="stat-value">${analytics.attendanceRate}%</div><div class="stat-label">tasa de asistencia</div></div>
      <div class="card card-sage"><div class="card-header"><div class="card-title">Programas</div><div class="card-icon">📚</div></div>
        <div class="stat-value">${analytics.totalPrograms}</div><div class="stat-label">activos</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">Clientes Recientes</div>
          <button class="top-btn ghost" style="padding:6px 12px;font-size:12px;" onclick="goTo('clientes', document.querySelectorAll('.nav-item')[2])">Ver todos →</button></div>
        ${clients.length === 0 ? emptyState('👥','Aún no tienes clientes','Agrega tu primer cliente para empezar a usar el CRM.','openModal(\'new-client-modal\')','+ Agregar cliente') :
          clients.slice(0,5).map(cl => `
          <div class="client-row">
            <div class="client-avatar" style="background:${stageColor(cl.stage)}">${initials(cl.name)}</div>
            <div class="client-info"><div class="client-name">${esc(cl.name)}</div><div class="client-stage">Etapa: ${cl.stage}${cl.program ? ' · '+esc(cl.program) : ''}</div></div>
          </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Próximas Sesiones</div>
          <button class="top-btn ghost" style="padding:6px 12px;font-size:12px;" onclick="goTo('sesiones', document.querySelectorAll('.nav-item')[3])">Ver agenda →</button></div>
        ${upcoming.length === 0 ? emptyState('📅','Sin sesiones agendadas','Agenda tu primera sesión con un cliente.','openModal(\'new-session-modal\')','+ Agendar sesión') :
          upcoming.map(s => {
            const client = clients.find(c => c.id === s.clientId);
            return `<div style="padding:12px;background:var(--cream);border-radius:10px;margin-bottom:8px;border-left:3px solid var(--violet-deep);">
              <div style="font-weight:700;font-size:13px;">${s.date} ${s.time} — ${client ? esc(client.name) : 'Cliente'}</div>
              <div style="color:var(--text-3);font-size:11px;margin-top:2px;">${esc(s.type)}${s.goal ? ' · '+esc(s.goal) : ''}</div>
            </div>`;
          }).join('')}
      </div>
    </div>`;
}

function stageColor(stage) {
  const colors = { SER:'linear-gradient(135deg,#8B5CF6,#C4B5FD)', HACER:'linear-gradient(135deg,#4B28FC,#8059FB)',
    TENER:'linear-gradient(135deg,#3FAE7A,#7EC8A4)', DAR:'linear-gradient(135deg,#E0A030,#F0C060)', RECIBIR:'linear-gradient(135deg,#E5484D,#F09090)' };
  return colors[stage] || 'linear-gradient(135deg,#A5A3B8,#D0CFDA)';
}
function initials(name) { const p = name.trim().split(' '); return ((p[0]?.[0]||'')+(p[1]?.[0]||'')).toUpperCase(); }
function esc(s) { return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function emptyState(icon,title,desc,onclick,btnText) {
  return `<div class="empty-state"><div class="icon">${icon}</div><div class="title">${title}</div><div class="desc">${desc}</div>
    ${btnText ? `<button class="top-btn primary" onclick="${onclick}">${btnText}</button>` : ''}</div>`;
}

// ── IA ASISTENTE ──
const chatHistory = [];
async function renderIAScreen(c) {
  c.innerHTML = `
    <div class="section-header"><div><div class="section-title2">IA Asistente de Coaching</div>
      <div class="section-sub2">Tu copiloto inteligente para sesiones, clientes y contenido</div></div></div>
    <div class="grid-2" style="gap:24px;align-items:start;">
      <div class="ai-panel">
        <div class="ai-label">✦ ECOSYS IA</div>
        <div class="chat-messages" id="chat-messages">
          <div class="msg ai"><div class="msg-avatar">🤖</div><div class="msg-bubble">Hola ${CURRENT_USER.name.split(' ')[0]}, soy tu asistente ECOSYS. Puedo ayudarte a preparar sesiones, crear contenido o analizar clientes. ¿Con qué empezamos?</div></div>
        </div>
        <div class="chat-input-row">
          <input class="chat-input" id="chat-input" placeholder="Escribe tu consulta..."/>
          <button class="chat-send" onclick="sendChat()">Enviar</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="card">
          <div class="card-title" style="margin-bottom:14px;">Acciones Rápidas</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="top-btn ghost" style="width:100%;justify-content:flex-start;" onclick="quickAction('Dame 5 preguntas poderosas para descubrir creencias limitantes de un cliente')">❓ Preguntas poderosas</button>
            <button class="top-btn ghost" style="width:100%;justify-content:flex-start;" onclick="quickAction('Escribe un email de seguimiento post-sesión genérico y cálido')">📧 Email de seguimiento</button>
            <button class="top-btn ghost" style="width:100%;justify-content:flex-start;" onclick="quickAction('Dame 3 ideas para un post de LinkedIn sobre coaching auténtico')">📱 Ideas de contenido</button>
            <button class="top-btn ghost" style="width:100%;justify-content:flex-start;" onclick="quickAction('Ayúdame a estructurar una propuesta de valor para un programa de coaching de 3 meses')">💼 Propuesta de valor</button>
          </div>
        </div>
        <div class="card card-violet">
          <div class="card-title" style="margin-bottom:10px;">Insight del Día</div>
          <div id="daily-insight" style="font-size:13px;line-height:1.7;color:var(--text-2);">Cargando...</div>
        </div>
      </div>
    </div>`;
  document.getElementById('chat-input').addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });
  loadDailyInsight();
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  const msgs = document.getElementById('chat-messages');
  msgs.innerHTML += `<div class="msg user"><div class="msg-avatar">${initials(CURRENT_USER.name)}</div><div class="msg-bubble">${esc(msg)}</div></div>`;
  msgs.innerHTML += `<div class="msg ai" id="typing-msg"><div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing-dots"><span>•</span><span>•</span><span>•</span></div></div></div>`;
  msgs.scrollTop = msgs.scrollHeight;
  chatHistory.push({ role:'user', content: msg });
  try {
    const data = await api('/api/ai/chat', { method:'POST', body: JSON.stringify({ messages: chatHistory }) });
    chatHistory.push({ role:'assistant', content: data.content });
    document.getElementById('typing-msg').outerHTML = `<div class="msg ai"><div class="msg-avatar">🤖</div><div class="msg-bubble">${data.content.replace(/\n/g,'<br>')}</div></div>`;
    msgs.scrollTop = msgs.scrollHeight;
  } catch (err) {
    document.getElementById('typing-msg').outerHTML = `<div class="msg ai"><div class="msg-avatar">🤖</div><div class="msg-bubble" style="color:var(--danger)">Error: ${err.message}</div></div>`;
  }
}
async function quickAction(prompt) {
  goTo('ia-coach', document.querySelectorAll('.nav-item')[1]);
  setTimeout(() => { document.getElementById('chat-input').value = prompt; sendChat(); }, 200);
}
let insightLoaded = false;
async function loadDailyInsight() {
  if (insightLoaded) return; insightLoaded = true;
  try { const data = await api('/api/ai/daily-insight'); document.getElementById('daily-insight').textContent = data.content; }
  catch (_) { document.getElementById('daily-insight').textContent = 'No disponible en este momento.'; }
}

// ── CLIENTES ──
async function renderClientes(c) {
  const clients = await api('/api/data/clients');
  CLIENTS_CACHE = clients;
  const limitMsg = PLAN_LIMITS?.clients !== undefined && PLAN_LIMITS.clients < 999999
    ? `<div class="upgrade-banner"><div class="upgrade-text">Plan Starter: <b>${clients.length}/${PLAN_LIMITS.clients}</b> clientes usados.</div>
        <button class="top-btn primary" onclick="goTo('plan', document.querySelectorAll('.nav-item')[6])">Actualizar plan →</button></div>` : '';

  c.innerHTML = `
    <div class="section-header"><div><div class="section-title2">Clientes & CRM</div><div class="section-sub2">${clients.length} cliente(s) registrado(s)</div></div>
      <button class="top-btn primary" onclick="openModal('new-client-modal')">+ Nuevo cliente</button></div>
    ${limitMsg}
    ${clients.length === 0 ? emptyState('👥','Tu CRM está vacío','Agrega tu primer cliente para empezar a gestionar tu práctica de coaching.','openModal(\'new-client-modal\')','+ Agregar primer cliente') : `
    <div class="table-wrap"><table>
      <thead><tr><th>Cliente</th><th>Programa</th><th>Etapa</th><th>Registrado</th><th></th></tr></thead>
      <tbody>${clients.map(cl => `
        <tr><td><b>${esc(cl.name)}</b><br><small style="color:var(--text-3)">${esc(cl.email)}</small></td>
          <td>${esc(cl.program)||'—'}</td>
          <td><span class="badge badge-violet">${cl.stage}</span></td>
          <td>${new Date(cl.createdAt).toLocaleDateString('es-CO')}</td>
          <td><button class="top-btn ghost" style="padding:5px 10px;font-size:11px;" onclick="deleteClient(${cl.id})">Eliminar</button></td>
        </tr>`).join('')}
      </tbody></table></div>`}
  `;
}

async function saveClient() {
  const name = document.getElementById('nc-name').value.trim();
  const email = document.getElementById('nc-email').value.trim();
  if (!name || !email) return showToast('Nombre y email son requeridos', '⚠');
  try {
    await api('/api/data/clients', { method:'POST', body: JSON.stringify({
      name, email,
      phone: document.getElementById('nc-phone').value,
      stage: document.getElementById('nc-stage').value,
      program: document.getElementById('nc-program').value,
      notes: document.getElementById('nc-notes').value
    })});
    closeModal('new-client-modal');
    ['nc-name','nc-email','nc-phone','nc-program','nc-notes'].forEach(id => document.getElementById(id).value = '');
    showToast('Cliente creado exitosamente');
    renderScreen('clientes');
  } catch (err) {
    if (err.data?.upgradeRequired) showUpgradeToast(err.message);
    else showToast(err.message, '⚠');
  }
}
async function deleteClient(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  await api('/api/data/clients/'+id, { method:'DELETE' });
  showToast('Cliente eliminado');
  renderScreen('clientes');
}

// ── SESIONES ──
async function renderSesiones(c) {
  const [sessions, clients] = await Promise.all([api('/api/data/sessions'), api('/api/data/clients')]);
  CLIENTS_CACHE = clients;
  c.innerHTML = `
    <div class="section-header"><div><div class="section-title2">Sesiones & Agenda</div><div class="section-sub2">${sessions.length} sesión(es) agendada(s)</div></div>
      <button class="top-btn primary" onclick="openSessionModal()">+ Nueva sesión</button></div>
    ${clients.length === 0 ? emptyState('📅','Primero necesitas un cliente','Agrega un cliente antes de agendar sesiones.','openModal(\'new-client-modal\')','+ Agregar cliente') :
      sessions.length === 0 ? emptyState('📅','Sin sesiones agendadas','Agenda tu primera sesión de coaching.','openSessionModal()','+ Agendar sesión') :
      `<div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom:14px;">Todas las Sesiones</div>
          ${sessions.map(s => {
            const client = clients.find(cl => cl.id === s.clientId);
            return `<div style="padding:14px;background:var(--cream);border-radius:10px;margin-bottom:10px;">
              <div style="font-weight:700;font-size:13px;">${s.date} ${s.time} · ${client ? esc(client.name) : 'Cliente'}</div>
              <div style="color:var(--text-3);font-size:11px;margin:4px 0;">${esc(s.type)}${s.goal ? ' — '+esc(s.goal) : ''}</div>
              <div style="display:flex;gap:8px;margin-top:8px;">
                <a href="${s.meetLink}" target="_blank" class="top-btn sage" style="padding:6px 12px;font-size:11px;text-decoration:none;">📹 Video llamada</a>
                <button class="top-btn ghost" style="padding:6px 12px;font-size:11px;" onclick="completeSession(${s.id})">✓ Marcar completada</button>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:14px;">Procesar Notas de Sesión con IA</div>
          <div class="form-group"><label class="form-label">Pega aquí la transcripción o dicta los puntos clave</label>
            <textarea class="form-textarea" id="session-notes-input" style="min-height:140px;"></textarea></div>
          <button class="top-btn primary" onclick="processSessionNotes()">✦ Procesar con IA</button>
          <div class="ai-output" id="session-notes-output" style="margin-top:14px;display:none;"></div>
        </div>
      </div>`}
  `;
}
function openSessionModal() {
  const sel = document.getElementById('ns-client');
  sel.innerHTML = CLIENTS_CACHE.map(cl => `<option value="${cl.id}">${esc(cl.name)}</option>`).join('');
  document.getElementById('ns-date').value = new Date().toISOString().slice(0,10);
  openModal('new-session-modal');
}
async function saveSession() {
  const clientId = document.getElementById('ns-client').value;
  const date = document.getElementById('ns-date').value;
  if (!clientId || !date) return showToast('Cliente y fecha son requeridos', '⚠');
  await api('/api/data/sessions', { method:'POST', body: JSON.stringify({
    clientId, date, time: document.getElementById('ns-time').value,
    type: document.getElementById('ns-type').value, goal: document.getElementById('ns-goal').value
  })});
  closeModal('new-session-modal');
  document.getElementById('ns-goal').value = '';
  showToast('Sesión agendada con link de video incluido');
  renderScreen('sesiones');
}
async function completeSession(id) {
  await api('/api/data/sessions/'+id, { method:'PUT', body: JSON.stringify({ status:'completed' }) });
  showToast('Sesión marcada como completada');
  renderScreen('sesiones');
}
async function processSessionNotes() {
  const notes = document.getElementById('session-notes-input').value;
  if (!notes) return showToast('Escribe las notas primero', '⚠');
  const out = document.getElementById('session-notes-output');
  out.style.display = 'block'; out.textContent = 'Procesando con IA...'; out.classList.add('loading');
  try {
    const data = await api('/api/ai/session-notes', { method:'POST', body: JSON.stringify({ notes }) });
    out.innerHTML = data.content.replace(/\n/g,'<br>'); out.classList.remove('loading');
  } catch (err) { out.textContent = 'Error: ' + err.message; out.classList.remove('loading'); }
}

// ── PROGRAMAS ──
async function renderProgramas(c) {
  if (!PLAN_LIMITS.programs) {
    c.innerHTML = `<div class="section-header"><div><div class="section-title2">Programas & Cursos</div></div></div>
      <div class="empty-state"><div class="icon">🔒</div><div class="title">Función disponible en Pro y Elite</div>
      <div class="desc">Crea programas ilimitados, define precios y gestiona inscripciones actualizando tu plan.</div>
      <button class="top-btn primary" onclick="goTo('plan', document.querySelectorAll('.nav-item')[6])">Ver planes →</button></div>`;
    return;
  }
  const programs = await api('/api/data/programs');
  PROGRAMS_CACHE = programs;
  c.innerHTML = `
    <div class="section-header"><div><div class="section-title2">Programas & Cursos</div><div class="section-sub2">${programs.length} programa(s) creado(s)</div></div>
      <button class="top-btn primary" onclick="openModal('new-program-modal')">+ Nuevo programa</button></div>
    ${programs.length === 0 ? emptyState('📚','Aún no tienes programas','Crea tu primer programa de coaching con precio y duración.','openModal(\'new-program-modal\')','+ Crear programa') :
      `<div class="grid-3">${programs.map(p => `
        <div class="card card-violet">
          <div style="font-family:'DM Serif Display',serif;font-size:17px;color:var(--night);margin-bottom:6px;">${esc(p.name)}</div>
          <div style="font-size:12px;color:var(--text-3);margin-bottom:14px;">${esc(p.duration)||'Sin duración definida'} · $${p.price} ${p.currency}</div>
          <div style="font-size:12px;color:var(--text-2);margin-bottom:14px;">${esc(p.description)||'Sin descripción'}</div>
          <div style="display:flex;gap:8px;">
            <span class="badge badge-sage">${p.enrollments} inscritos</span>
            <button class="top-btn ghost" style="padding:4px 10px;font-size:11px;margin-left:auto;" onclick="deleteProgram(${p.id})">Eliminar</button>
          </div>
        </div>`).join('')}</div>`}
  `;
}
async function saveProgram() {
  const name = document.getElementById('np-name').value.trim();
  const price = document.getElementById('np-price').value;
  if (!name || !price) return showToast('Nombre y precio son requeridos', '⚠');
  try {
    await api('/api/data/programs', { method:'POST', body: JSON.stringify({
      name, price, duration: document.getElementById('np-duration').value,
      description: document.getElementById('np-desc').value, currency:'USD'
    })});
    closeModal('new-program-modal');
    ['np-name','np-duration','np-price','np-desc'].forEach(id => document.getElementById(id).value = '');
    showToast('Programa creado');
    renderScreen('programas');
  } catch (err) {
    if (err.data?.upgradeRequired) showUpgradeToast(err.message);
    else showToast(err.message, '⚠');
  }
}
async function deleteProgram(id) {
  if (!confirm('¿Eliminar este programa?')) return;
  await api('/api/data/programs/'+id, { method:'DELETE' });
  showToast('Programa eliminado');
  renderScreen('programas');
}

// ── HERRAMIENTAS ──
async function renderHerramientas(c) {
  const tools = await api('/api/data/tools');
  TOOLS_CACHE = tools;
  const cats = ['SER','HACER','TENER','DAR','RECIBIR'];
  c.innerHTML = `
    <div class="section-header"><div><div class="section-title2">Herramientas de Coaching</div>
      <div class="section-sub2">${tools.filter(t=>!t.locked).length} de 60 herramientas disponibles en tu plan</div></div></div>
    <div class="tabs">
      <div class="tab active" onclick="switchToolTab(this,'todas')">Todas</div>
      ${cats.map(cat => `<div class="tab" onclick="switchToolTab(this,'${cat}')">${cat}</div>`).join('')}
    </div>
    <div id="tools-tab-todas" class="tab-content active">${renderToolsGrid(tools)}</div>
    ${cats.map(cat => `<div id="tools-tab-${cat}" class="tab-content">${renderToolsGrid(tools.filter(t=>t.cat===cat))}</div>`).join('')}
  `;
}
function renderToolsGrid(tools) {
  if (tools.length === 0) return emptyState('🧰','Sin herramientas en esta categoría','','','');
  return `<div class="grid-4">${tools.map(t => `
    <div class="tool-card ${t.locked?'locked':''}" onclick="${t.locked ? `showUpgradeToast('${t.name} requiere plan Pro o Elite')` : `openTool('${t.id}')`}">
      ${t.locked ? '<div class="tool-lock-badge">🔒</div>' : ''}
      <div class="tool-cat">${t.cat}</div>
      <div class="tool-icon">${t.icon}</div>
      <div class="tool-name">${t.name}</div>
      <div class="tool-desc">${t.desc}</div>
    </div>`).join('')}</div>`;
}
function switchToolTab(el, tab) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tools-tab-'+tab).classList.add('active');
}

async function openTool(toolId) {
  const tool = TOOLS_CACHE.find(t => t.id === toolId);
  if (!tool) return;
  document.getElementById('tool-modal-title').textContent = tool.name;

  const clientOptions = CLIENTS_CACHE.length
    ? `<div class="form-group"><label class="form-label">Cliente (opcional — para guardar en su historial)</label>
        <select class="form-select" id="tool-client"><option value="">Sin asignar</option>${CLIENTS_CACHE.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div>`
    : `<div style="font-size:12px;color:var(--text-3);margin-bottom:14px;">💡 Agrega un cliente en el CRM para poder guardar este análisis en su historial.</div>`;

  const fieldsHtml = tool.fields.map(f => {
    if (f.type === 'range') return `<div class="form-group"><label class="form-label">${f.label}</label>
      <input type="range" min="1" max="10" value="5" class="tool-field" data-key="${f.k}" style="width:100%;accent-color:var(--violet-deep);"/></div>`;
    if (f.type === 'textarea') return `<div class="form-group"><label class="form-label">${f.label}</label>
      <textarea class="form-textarea tool-field" data-key="${f.k}"></textarea></div>`;
    return `<div class="form-group"><label class="form-label">${f.label}</label>
      <input class="form-input tool-field" data-key="${f.k}"/></div>`;
  }).join('');

  document.getElementById('tool-modal-body').innerHTML = `
    ${clientOptions}
    ${fieldsHtml}
    <button class="top-btn primary" style="width:100%;margin-top:10px;" onclick="runToolAnalysis('${toolId}')">✦ Analizar con IA</button>
    <div class="ai-output" id="tool-ai-output" style="margin-top:16px;display:none;"></div>
  `;
  openModal('tool-modal');
}

async function runToolAnalysis(toolId) {
  const inputs = {};
  document.querySelectorAll('.tool-field').forEach(f => { inputs[f.dataset.key] = f.value; });
  const clientSel = document.getElementById('tool-client');
  const clientId = clientSel ? clientSel.value : null;
  const clientName = clientId ? CLIENTS_CACHE.find(c => c.id == clientId)?.name : null;

  const out = document.getElementById('tool-ai-output');
  out.style.display = 'block'; out.classList.add('loading'); out.textContent = 'Analizando con IA...';

  try {
    const data = await api('/api/ai/tool-analysis', { method:'POST', body: JSON.stringify({ toolId, inputs, clientName }) });
    out.classList.remove('loading');
    out.innerHTML = data.content.replace(/\n/g,'<br>');
    if (clientId) {
      await api('/api/data/tool-runs', { method:'POST', body: JSON.stringify({ clientId, toolId, inputs, aiOutput: data.content }) });
    }
  } catch (err) {
    out.classList.remove('loading');
    out.textContent = 'Error: ' + err.message;
  }
}

// ── ANALYTICS ──
async function renderAnalytics(c) {
  const analytics = await api('/api/data/analytics');
  const stages = analytics.stageDistribution;
  const maxStage = Math.max(1, ...Object.values(stages));
  c.innerHTML = `
    <div class="section-header"><div><div class="section-title2">Analytics</div><div class="section-sub2">Métricas reales de tu práctica</div></div></div>
    <div class="grid-4" style="margin-bottom:24px;">
      <div class="card"><div class="card-title">Clientes totales</div><div class="stat-value">${analytics.totalClients}</div></div>
      <div class="card"><div class="card-title">Sesiones este mes</div><div class="stat-value">${analytics.sessionsThisMonth}</div></div>
      <div class="card"><div class="card-title">Tasa de asistencia</div><div class="stat-value">${analytics.attendanceRate}%</div></div>
      <div class="card"><div class="card-title">NPS promedio</div><div class="stat-value">${analytics.avgNPS || '—'}</div></div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:16px;">Distribución de clientes por etapa</div>
      ${Object.entries(stages).map(([stage,count]) => `
        <div class="progress-wrap"><div class="progress-header"><span>${stage}</span><span>${count} cliente(s)</span></div>
          <div class="progress-bar"><div class="progress-fill violet" style="width:${(count/maxStage)*100}%"></div></div></div>`).join('')}
    </div>`;
}

// ── MI PLAN ──
async function renderPlanScreen(c) {
  const plans = [
    { id:'starter', name:'Starter', price:'$0', period:'Gratis para siempre', features:['Hasta 3 clientes','10 herramientas','Agenda de sesiones','IA limitada'] },
    { id:'pro', name:'Pro', price:'$47', period:'/mes', features:['Clientes ilimitados','60 herramientas completas','Programas ilimitados','Pagos integrados','IA ilimitada'] },
    { id:'elite', name:'Elite', price:'$97', period:'/mes', features:['Todo lo de Pro','White-label completo','Dominio personalizado','Soporte prioritario'] }
  ];
  c.innerHTML = `
    <div class="section-header"><div><div class="section-title2">Mi Plan</div><div class="section-sub2">Plan actual: <b style="color:var(--violet-deep)">${PLAN_NAMES[CURRENT_USER.plan]}</b></div></div></div>
    <div class="grid-3">
      ${plans.map(p => `
        <div class="card ${p.id===CURRENT_USER.plan?'card-violet':''}">
          <div style="font-family:'DM Serif Display',serif;font-size:19px;color:var(--night);">${p.name}</div>
          <div style="font-family:'DM Serif Display',serif;font-size:30px;color:var(--night);margin:8px 0;">${p.price}<span style="font-size:13px;color:var(--text-2);font-family:'DM Sans'">${p.period}</span></div>
          ${p.features.map(f => `<div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px;">✓ ${f}</div>`).join('')}
          ${p.id === CURRENT_USER.plan
            ? `<div class="badge badge-sage" style="margin-top:16px;">Plan actual</div>`
            : `<button class="top-btn primary" style="width:100%;margin-top:16px;" onclick="upgradePlan('${p.id}')">Cambiar a ${p.name}</button>`}
        </div>`).join('')}
    </div>
    <div style="margin-top:20px;font-size:12px;color:var(--text-3);text-align:center;">
      💡 En producción, el cambio de plan se conecta a Wompi/MercadoPago para procesar el pago real antes de activar el upgrade.
    </div>`;
}
async function upgradePlan(plan) {
  const data = await api('/api/auth/upgrade', { method:'POST', body: JSON.stringify({ plan }) });
  saveSession(data);
  showToast(`Plan actualizado a ${PLAN_NAMES[plan]}`);
  document.getElementById('tools-badge').textContent = PLAN_LIMITS?.toolsUnlocked === 60 ? '60' : `${PLAN_LIMITS?.toolsUnlocked||10}/60`;
  document.getElementById('lock-programas').textContent = PLAN_LIMITS?.programs ? '' : '🔒';
  document.getElementById('user-plan-el').textContent = PLAN_NAMES[CURRENT_USER.plan];
  renderScreen('plan');
}
