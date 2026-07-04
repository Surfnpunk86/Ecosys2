# ECOSYS v2 — Guía de Deploy para Howard
## Sistema completo y funcional · ~25 minutos

---

## ANTES DE EMPEZAR — Qué cambió respecto a la versión anterior

Esta versión reemplaza completamente la anterior. Ya no es un solo archivo HTML — es una aplicación real con:

- **Registro y login reales** — cada coach crea su propia cuenta con contraseña
- **3 planes con límites reales** — Starter (gratis), Pro ($47/mes), Elite ($97/mes)
- **Base de datos persistente** — los clientes, sesiones y programas se guardan de verdad
- **60 herramientas de coaching funcionales** — cada una con formulario propio y análisis de IA real
- **CRM, sesiones, programas y analytics conectados a datos reales** — nada es decorativo

**Importante:** los planes Pro/Elite se muestran y se pueden "activar" desde el panel Mi Plan, pero el cobro real vía Wompi/MercadoPago **no está conectado todavía** — ese es el siguiente paso técnico (ver sección 6).

---

## PASO 1 — Generar el JWT_SECRET

No necesitas hacer nada manual: Render lo genera automáticamente (ver `render.yaml`, tiene `generateValue: true`). Si prefieres generarlo tú:

```
https://generate-secret.vercel.app/64
```

---

## PASO 2 — Subir el código a GitHub

```bash
cd ecosys-platform
git init
git add .
git commit -m "ECOSYS v2 — sistema completo con auth, CRM, 60 herramientas"
git remote add origin https://github.com/TU_USUARIO/ecosys-platform.git
git push -u origin main
```

**Importante:** el archivo `.gitignore` ya excluye `data/db.json` — así cada entorno (local vs producción) tiene su propia base de datos y no se sobreescriben datos reales con datos de prueba.

---

## PASO 3 — Crear el servicio en Render

1. https://render.com → Sign in con GitHub
2. **"New +"** → **"Web Service"** → conecta el repo `ecosys-platform`
3. Render detecta `render.yaml` automáticamente:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Disk:** 1GB persistente en `/data` (para que la base de datos sobreviva a reinicios)

4. En **"Environment Variables"** agrega:

| Variable | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | La clave de Renzo (`sk-ant-api03-...`) |
| `NODE_ENV` | `production` |

`JWT_SECRET` se genera solo (está en `render.yaml`).

5. Click **"Create Web Service"**

---

## PASO 4 — Verificar que el disco persistente está activo

Esto es crítico — sin esto, **cada vez que Render reinicie el servicio se borran todos los usuarios y clientes**.

1. En el dashboard de Render → tu servicio → **"Disks"**
2. Confirma que existe un disco llamado `ecosys-data` montado en `/opt/render/project/src/data`
3. Si no aparece automáticamente, créalo manualmente: **"Add Disk"** → mismo path → 1GB

---

## PASO 5 — Conectar el dominio

Igual que antes:
1. Render → Settings → Custom Domains → agregar dominio
2. Copiar el valor CNAME que da Render
3. En el DNS del dominio (GoDaddy, Cloudflare, etc.) crear registro CNAME apuntando a ese valor
4. Esperar propagación (5-15 min) — Render emite SSL automático

---

## PASO 6 — Verificación funcional completa

Abre el dominio y prueba en este orden exacto:

- [ ] La landing carga con el logo real y los 3 planes visibles
- [ ] Click "Empezar gratis" → se abre el modal de registro
- [ ] Crear una cuenta nueva (plan Starter) → debe entrar directo al dashboard
- [ ] Dashboard muestra "0 clientes" (vacío, real, no inventado)
- [ ] Ir a Clientes & CRM → crear un cliente → debe aparecer en la tabla
- [ ] Ir a Herramientas → deben verse 10 desbloqueadas y 50 con candado 🔒
- [ ] Abrir una herramienta desbloqueada (ej: Rueda de la Vida) → llenar → "Analizar con IA" → debe responder la IA real
- [ ] Ir a Sesiones → agendar una sesión con el cliente creado → debe aparecer con link de Google Meet
- [ ] Ir a Mi Plan → cambiar a Pro → las 60 herramientas deben desbloquearse inmediatamente
- [ ] Cerrar sesión → volver a iniciar sesión con el mismo email/contraseña → los datos deben seguir ahí
- [ ] Abrir el sitio desde el teléfono → debe verse responsive

Si algo falla: Render → tu servicio → **"Logs"** para ver el error exacto.

---

## PASO 7 — Conectar pagos reales (Wompi) — siguiente fase

AhMismo el botón "Cambiar a Pro/Elite" en Mi Plan actualiza el plan directamente sin cobrar. Para conectar el cobro real:

1. Crear cuenta en https://wompi.co (Colombia) — requiere NIT/RUT del negocio
2. Obtener llaves pública y privada del dashboard de Wompi
3. Howard necesita agregar:
   - Un endpoint `/api/payments/create-checkout` que genere el link de pago de Wompi
   - Un webhook `/api/payments/webhook` que reciba la confirmación de Wompi y ahí sí llame a `/api/auth/upgrade`
4. Este paso requiere ~3-4 horas de desarrollo adicional — si quieres, en la próxima iteración lo construyo completo

**Por ahora, el flujo de planes es 100% funcional para probar la experiencia — solo falta el cobro real.**

---

## ESTRUCTURA DEL PROYECTO

```
ecosys-platform/
├── server/
│   ├── index.js           ← Servidor Express principal
│   ├── auth.js             ← Registro, login, verificación JWT
│   ├── routes.js           ← CRM, sesiones, programas, herramientas, analytics
│   ├── db.js                ← Base de datos JSON persistente + límites por plan
│   └── tools-catalog.js    ← Las 60 herramientas de coaching (definición completa)
├── public/
│   ├── index.html          ← Landing + planes + auth modal + app shell
│   ├── app.js               ← Toda la lógica del frontend (100% conectada al backend)
│   ├── style.css            ← Diseño completo (paleta violeta del logo real)
│   ├── logo-nav.png         ← Logo para navbar/landing
│   ├── logo-sidebar.png     ← Logo para sidebar de la app
│   └── logo-hero.png        ← Logo tamaño hero
├── data/
│   └── db.json              ← Base de datos (se auto-crea, NO se sube a git)
├── package.json
├── render.yaml               ← Configuración de deploy con disco persistente
└── .env.example
```

---

## NOTAS TÉCNICAS IMPORTANTES

- **Multi-usuario real:** cada coach que se registra tiene sus propios clientes, sesiones y programas — completamente aislados entre sí
- **Base de datos:** actualmente es un archivo JSON en disco. Funciona perfecto hasta ~50-100 coaches activos. Para más escala, hay que migrar a PostgreSQL (Supabase) — mismo patrón de código, cambio de la capa `db.js` únicamente
- **Seguridad:** contraseñas hasheadas con bcrypt (12 rounds), tokens JWT de 30 días, rate limiting en login y en llamadas de IA
- **Las 60 herramientas:** cada una tiene su propio formulario dinámico generado desde `tools-catalog.js` — agregar una herramienta nueva es agregar un objeto a ese archivo, no tocar el frontend
