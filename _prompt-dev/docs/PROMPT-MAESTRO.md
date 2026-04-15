# PROMPT MAESTRO — CLAUDE CODE
## Proyecto: IncluIA — Asistente de Educación Inclusiva con IA
## Versión: 1.0 | Fecha: Abril 2026

---

## 🧠 ROL Y CONTEXTO

Sos un desarrollador full-stack senior con experiencia en aplicaciones SaaS educativas, integración de IA y pasarelas de pago en Argentina. Vas a construir **"IncluIA"** — una aplicación web SaaS que ayuda a docentes de todo el sistema educativo argentino a planificar clases inclusivas para alumnos con discapacidad, usando la API de Claude (Anthropic) como motor de inteligencia artificial.

**Modelo de negocio:** SaaS privado con suscripción mensual cobrada a docentes individuales vía Mercado Pago.

**Alcance geográfico:** Toda Argentina.

**Objetivo:** Aplicación de producción real, lista para cobrar desde el día uno. No es un prototipo, no es una demo. Es un producto comercial.

---

## 📋 DOCUMENTACIÓN DE REFERENCIA

Antes de escribir cualquier línea de código, LEÉS los siguientes archivos de referencia que contienen datos maestros, tipos, lógica de negocio y esquema de base de datos ya definidos:

| Archivo | Contenido | Prioridad |
|---------|-----------|-----------|
| `docs/ARQUITECTURA.md` | Stack, estructura de carpetas, flujos | LEER PRIMERO |
| `docs/DATOS-MAESTROS.md` | Niveles, materias, discapacidades del sistema educativo argentino | LEER PRIMERO |
| `docs/BASE-DE-DATOS.md` | Schema SQL completo para Supabase, RLS, triggers, funciones | LEER PRIMERO |
| `docs/PROMPTS-IA.md` | System prompt, builder de prompts, lógica de generación | LEER PRIMERO |
| `docs/PAGOS.md` | Integración con Mercado Pago, flujo de suscripción | LEER ANTES DE FASE 4 |
| `docs/UI-UX.md` | Diseño visual, componentes, accesibilidad, responsive | REFERENCIA CONTINUA |

**REGLA:** No inventes datos que ya están definidos en estos archivos. Usalos textualmente. Si necesitás agregar algo, primero verificá que no contradiga lo existente.

---

## 🔧 STACK TECNOLÓGICO

```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS 3.4 + shadcn/ui
Backend:      API Routes de Next.js (Route Handlers)
IA:           Anthropic Claude API (claude-sonnet-4-20250514)
Base de datos: Supabase (PostgreSQL + Auth + RLS + Storage)
Pagos:        Mercado Pago SDK Argentina (checkout pro + suscripciones)
Deploy:       Vercel
Email:        Resend (transaccional)
Analytics:    Vercel Analytics (incluido)
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
inclua/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── registro/
│   │   │   └── page.tsx
│   │   ├── verificar-email/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Layout con Navbar, protección auth, check plan
│   │   ├── inicio/
│   │   │   └── page.tsx            ← Home del docente logueado
│   │   ├── nueva-consulta/
│   │   │   └── page.tsx            ← Formulario 3 pasos
│   │   ├── resultado/
│   │   │   └── page.tsx            ← Respuesta IA con streaming
│   │   ├── historial/
│   │   │   └── page.tsx            ← Lista de consultas guardadas (PRO)
│   │   ├── perfil/
│   │   │   └── page.tsx            ← Datos del docente + plan activo
│   │   └── planes/
│   │       └── page.tsx            ← Pricing + botón Mercado Pago
│   ├── api/
│   │   ├── generar-guia/
│   │   │   └── route.ts            ← POST: llama a Claude con streaming
│   │   ├── guardar-consulta/
│   │   │   └── route.ts            ← POST: guarda consulta en Supabase
│   │   ├── feedback/
│   │   │   └── route.ts            ← POST: guardar estrellas
│   │   ├── mercadopago/
│   │   │   ├── crear-preferencia/
│   │   │   │   └── route.ts        ← POST: crea preferencia de pago
│   │   │   └── webhook/
│   │   │       └── route.ts        ← POST: recibe notificaciones de MP
│   │   └── check-plan/
│   │       └── route.ts            ← GET: verifica plan y límites
│   ├── landing/
│   │   └── page.tsx                ← Landing pública (home no logueado)
│   ├── exito-pago/
│   │   └── page.tsx                ← Redirect post-pago exitoso
│   ├── layout.tsx                  ← Root layout
│   ├── page.tsx                    ← Redirect a landing o dashboard
│   └── globals.css
├── components/
│   ├── forms/
│   │   ├── StepContexto.tsx        ← Paso 1: nivel, materia, contenido
│   │   ├── StepDiscapacidad.tsx    ← Paso 2: discapacidades, apoyo
│   │   ├── StepAdicional.tsx       ← Paso 3: contexto libre, objetivo, resumen
│   │   ├── ProgressBar.tsx         ← Barra de progreso 3 pasos
│   │   └── FormWrapper.tsx         ← Wrapper con navegación entre pasos
│   ├── resultado/
│   │   ├── GuiaCompleta.tsx        ← Renderiza la guía con secciones
│   │   ├── SeccionGuia.tsx         ← Cada sección colapsable
│   │   ├── StreamingText.tsx       ← Componente de streaming letra a letra
│   │   ├── AccionesGuia.tsx        ← Copiar, imprimir, guardar, PDF
│   │   └── FeedbackEstrellas.tsx   ← Rating 1-5
│   ├── historial/
│   │   ├── HistorialList.tsx       ← Lista con filtros
│   │   └── HistorialCard.tsx       ← Card individual
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── ComoFunciona.tsx
│   │   ├── GridDiscapacidades.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   ├── layout/
│   │   ├── Navbar.tsx              ← Navbar del dashboard
│   │   ├── MobileMenu.tsx
│   │   └── PlanBadge.tsx           ← Badge "Free" / "Pro"
│   ├── shared/
│   │   ├── LoadingSpinner.tsx
│   │   ├── PaywallModal.tsx        ← Modal cuando agotó guías gratis
│   │   ├── Toast.tsx
│   │   └── ConfirmModal.tsx
│   └── ui/                         ← shadcn/ui components
├── lib/
│   ├── types.ts                    ← COPIAR DE docs/DATOS-MAESTROS.md
│   ├── anthropic.ts                ← Cliente Anthropic
│   ├── supabase/
│   │   ├── client.ts               ← Cliente browser
│   │   ├── server.ts               ← Cliente server (cookies)
│   │   └── admin.ts                ← Cliente admin (service role)
│   ├── mercadopago.ts              ← Config y helpers de MP
│   ├── prompts.ts                  ← COPIAR DE docs/PROMPTS-IA.md
│   ├── plan-limits.ts              ← Lógica de límites por plan
│   └── utils.ts                    ← Helpers generales
├── data/
│   ├── niveles.ts                  ← COPIAR DE docs/DATOS-MAESTROS.md
│   ├── materias.ts                 ← COPIAR DE docs/DATOS-MAESTROS.md
│   └── discapacidades.ts           ← COPIAR DE docs/DATOS-MAESTROS.md
├── hooks/
│   ├── useAuth.ts                  ← Hook de autenticación
│   ├── usePerfil.ts                ← Hook datos del perfil
│   ├── usePlan.ts                  ← Hook estado del plan y límites
│   └── useConsulta.ts              ← Hook para generar y guardar consultas
├── middleware.ts                    ← Protección de rutas auth
├── .env.local.example
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 🚀 ORDEN DE DESARROLLO — FASES

### FASE 1: Setup y fundación (30 min)
```
Objetivo: Proyecto corriendo en local con todas las dependencias

Tareas:
1. npx create-next-app@latest inclua --typescript --tailwind --app --src-dir=false
2. Instalar dependencias:
   - npm install @supabase/supabase-js @supabase/ssr
   - npm install @anthropic-ai/sdk
   - npm install mercadopago
   - npx shadcn@latest init
   - npx shadcn@latest add button card input label select textarea badge dialog toast tabs separator skeleton
3. Crear estructura de carpetas completa
4. Copiar archivos de datos maestros desde docs/DATOS-MAESTROS.md:
   - data/niveles.ts
   - data/materias.ts
   - data/discapacidades.ts
   - lib/types.ts
5. Copiar lib/prompts.ts desde docs/PROMPTS-IA.md
6. Configurar .env.local con variables placeholder
7. Configurar tailwind.config.ts con la paleta de colores (ver docs/UI-UX.md)
8. Crear layout raíz con fuentes (DM Sans + Fraunces de Google Fonts)

Resultado: `npm run dev` funciona sin errores
```

### FASE 2: Autenticación completa (45 min)
```
Objetivo: Registro, login, logout, middleware de protección

Tareas:
1. Configurar Supabase Auth con email/password
2. Ejecutar schema.sql en Supabase (desde docs/BASE-DE-DATOS.md)
3. Crear lib/supabase/client.ts (browser)
4. Crear lib/supabase/server.ts (server con cookies)
5. Crear lib/supabase/admin.ts (service role para webhooks)
6. Crear página de registro:
   - Campos: nombre, apellido, email, contraseña, institución, localidad, provincia
   - Provincia: dropdown con las 24 provincias argentinas
   - Al registrarse: Supabase Auth crea usuario → trigger crea perfil con plan "free"
7. Crear página de login (email + contraseña)
8. Crear página verificar-email (post-registro)
9. Crear middleware.ts:
   - Rutas /inicio, /nueva-consulta, /resultado, /historial, /perfil → requieren auth
   - Rutas /login, /registro → redirigir a /inicio si ya logueado
   - /landing → siempre pública
10. Crear hook useAuth.ts
11. Crear hook usePerfil.ts (carga datos del perfil desde Supabase)

Resultado: Un docente puede registrarse, loguearse y ver /inicio protegido
```

### FASE 3: Formulario + Generación con IA (60 min)
```
Objetivo: El flujo completo: formulario 3 pasos → llamada a Claude → resultado con streaming

Tareas:
1. Crear FormWrapper.tsx con navegación entre pasos y validación
2. Crear ProgressBar.tsx (barra visual de 3 pasos)
3. Crear StepContexto.tsx (Paso 1):
   - Select nivel → carga subniveles dinámicamente desde data/niveles.ts
   - Select subnivel → carga años
   - Select materia → carga desde data/materias.ts según nivel
   - Textarea contenido (obligatorio)
   - Validación en tiempo real (bordes verdes cuando completo)
4. Crear StepDiscapacidad.tsx (Paso 2):
   - Grid de cards seleccionables (multi-select) desde data/discapacidades.ts
   - Cada card: ícono + nombre + tooltip con descripción
   - Si selecciona "otra" → input adicional
   - Input number: cantidad de alumnos
   - Radio buttons: situación de apoyo
5. Crear StepAdicional.tsx (Paso 3):
   - Textarea contexto del aula (opcional)
   - Textarea objetivo de la clase (opcional)
   - Card resumen visual de todo lo completado
   - Botón "Generar guía inclusiva" con animación
6. Crear API route /api/generar-guia/route.ts:
   - Recibe POST con datos del formulario
   - Verifica autenticación (Supabase server)
   - Verifica límite del plan (consultas_mes vs límite)
   - Construye prompt con buildPrompt() de lib/prompts.ts
   - Llama a Claude con streaming (messages.stream)
   - Retorna ReadableStream al frontend
   - Al finalizar: guarda consulta en Supabase + incrementa contador
7. Crear StreamingText.tsx:
   - Consume el stream del API route
   - Muestra texto apareciendo progresivamente
   - Cursor parpadeante al final mientras carga
8. Crear GuiaCompleta.tsx:
   - Parsea el markdown de la respuesta en secciones
   - Cada sección con ícono, color y encabezado distintivo
   - Secciones colapsables/expandibles
9. Crear AccionesGuia.tsx:
   - Botón "Copiar todo" (clipboard API)
   - Botón "Copiar sección" en cada bloque
   - Botón "Imprimir" (window.print con CSS @media print)
   - Botón "Guardar en historial" (solo PRO, sino PaywallModal)
10. Crear FeedbackEstrellas.tsx:
    - Rating 1-5 estrellas con animación
    - POST a /api/feedback
11. Crear API route /api/guardar-consulta/route.ts
12. Crear API route /api/feedback/route.ts
13. Crear hook useConsulta.ts (maneja el estado del flujo completo)
14. Crear PaywallModal.tsx:
    - Se muestra cuando el docente free agotó sus 2 guías
    - O cuando intenta usar features PRO (historial, guardar, PDF)
    - Botón "Ver planes" → /planes

Resultado: Un docente puede completar el formulario, generar una guía con IA y verla en streaming
```

### FASE 4: Mercado Pago + Planes (45 min)
```
Objetivo: Cobrar suscripción mensual vía Mercado Pago

Tareas:
1. Crear cuenta Mercado Pago desarrollador (si no existe)
2. Obtener credenciales: ACCESS_TOKEN, PUBLIC_KEY
3. Crear lib/mercadopago.ts con config del SDK
4. Crear lib/plan-limits.ts:
   - Función checkPlanLimits(userId): verifica consultas_mes vs límite del plan
   - Función getPlanInfo(userId): retorna info del plan activo
   - Constantes LIMITES_PLAN (free: 2/mes, pro: 40/mes)
5. Crear página /planes:
   - Cards con plan Free vs Pro ($9.900/mes)
   - Features de cada plan
   - Botón "Suscribirme" → crea preferencia de pago
6. Crear API route /api/mercadopago/crear-preferencia/route.ts:
   - Crea checkout preference de Mercado Pago
   - Item: "IncluIA Plan Profesional — Mes [actual]"
   - Precio: 9900 ARS
   - back_urls: success → /exito-pago, failure → /planes, pending → /planes
   - notification_url → /api/mercadopago/webhook
   - external_reference: `{userId}_{plan}__{timestamp}`
   - Retorna URL de checkout
7. Crear API route /api/mercadopago/webhook/route.ts:
   - Recibe notificación IPN de Mercado Pago
   - Verifica firma/autenticidad
   - Si payment.status === 'approved':
     → Actualizar perfil: plan = 'pro', plan_activo_hasta = +30 días
     → Insertar en tabla pagos
   - Loguear todo para debug
8. Crear página /exito-pago:
   - Mensaje de bienvenida al plan Pro
   - Confetti o animación de éxito
   - Botón "Crear mi primera guía Pro"
9. Crear API route /api/check-plan/route.ts:
   - GET: retorna plan actual, consultas restantes, fecha vencimiento
10. Crear hook usePlan.ts:
    - Carga info del plan
    - Expone: plan, consultasRestantes, esPro, planVencido
11. Integrar verificación de plan en:
    - /api/generar-guia → rechazar si excede límite
    - Dashboard layout → mostrar badge de plan
    - Formulario → mostrar contador "X guías restantes"

Resultado: Un docente puede pagar con Mercado Pago y acceder al plan Pro
```

### FASE 5: Landing page pública (30 min)
```
Objetivo: Landing profesional que convierte visitantes en registros

Tareas:
1. Crear Hero.tsx:
   - Título: "Planificá clases inclusivas en minutos"
   - Subtítulo: "IA especializada en educación inclusiva para docentes argentinos"
   - CTA: "Crear mi primera guía — gratis"
   - Badge: "🇦🇷 Para docentes de toda Argentina"
   - Fondo con gradiente azul oscuro profesional
2. Crear ComoFunciona.tsx:
   - 3 pasos visuales: Completá → La IA genera → Aplicá en el aula
3. Crear GridDiscapacidades.tsx:
   - Grid de todas las discapacidades con íconos
   - Texto: "Guías para todas las discapacidades"
4. Crear Pricing.tsx:
   - Cards Free vs Pro con features
   - CTA diferenciados
5. Crear Footer.tsx:
   - "Hecho en Argentina 🇦🇷"
   - Links básicos
6. Crear testimonios hardcodeados (3-4 ficticios pero realistas para MVP):
   - "María, docente de primaria en Tucumán"
   - "Carlos, maestro integrador en Buenos Aires"
   - etc.

Resultado: Landing profesional que genera confianza y convierte
```

### FASE 6: Historial y perfil (30 min)
```
Objetivo: Docentes Pro pueden ver su historial y gestionar perfil

Tareas:
1. Crear /historial:
   - Lista de consultas del docente (paginada)
   - Filtros: por nivel, materia, discapacidad, fecha
   - Cards con: título, fecha, discapacidades, materia
   - Click → expande y muestra respuesta completa
   - Botón favorita (estrella)
   - Botón eliminar con confirmación
   - Si plan free → PaywallModal
2. Crear /perfil:
   - Datos editables: nombre, apellido, institución, localidad, provincia
   - Info del plan activo + fecha vencimiento
   - Contador de guías generadas total y este mes
   - Botón "Cambiar plan" → /planes
3. Crear /inicio (dashboard home):
   - Saludo personalizado "Hola, [nombre]"
   - Botón grande "Nueva consulta"
   - Últimas 3 consultas recientes (acceso rápido)
   - Contador de guías restantes este mes
   - Tip del día sobre educación inclusiva (array rotativo hardcodeado)

Resultado: Experiencia completa de usuario logueado
```

### FASE 7: Pulido, accesibilidad y deploy (30 min)
```
Objetivo: App lista para producción

Tareas:
1. Responsive completo:
   - Probar en 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px+
   - Formulario debe ser perfecto en mobile
   - Navbar con menú hamburguesa en mobile
2. Accesibilidad:
   - Contraste WCAG AA en todos los textos
   - Labels asociados a todos los inputs
   - Aria-labels en botones con solo íconos
   - Focus visible en todos los interactivos
   - Skip to content link
   - Probar con tab navigation
3. Performance:
   - Lazy loading de componentes pesados
   - Skeleton loading en resultado y historial
   - Optimistic UI en guardar/feedback
4. Manejo de errores:
   - Error boundary global
   - Mensajes amigables si Claude API falla
   - Retry automático en errores de red
   - Toast notifications para éxito/error
5. SEO básico:
   - Meta tags en landing
   - Open Graph para compartir
   - Favicon + apple-touch-icon
   - robots.txt + sitemap.xml
6. Deploy en Vercel:
   - Configurar variables de entorno
   - Dominio: inclua.com.ar o similar
   - Verificar webhook de Mercado Pago con URL de producción
7. Testing manual:
   - Flujo completo: registro → login → formulario → generar → guardar
   - Flujo pago: plan free → agotar guías → pagar → plan pro
   - Caso extremo: docente rural + TEA + sin apoyo (el más exigente)

Resultado: App en producción, cobrando
```

---

## ⚙️ VARIABLES DE ENTORNO

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=IncluIA
```

---

## 🎨 DIRECTRICES DE DISEÑO (resumen — detalle en docs/UI-UX.md)

### Paleta:
- Primario: `#1e3a5f` (azul institucional oscuro)
- Primario claro: `#2a5a8f`
- Primario bg: `#e8f0fe`
- Acento: `#16a34a` (verde inclusión)
- Acento claro: `#dcfce7`
- Naranja: `#ea580c` (CTA, alertas)
- Fondo: `#f5f7fa`
- Texto: `#1a2332`
- Texto light: `#64748b`
- Borde: `#e2e8f0`

### Tipografía:
- Display/títulos: `Fraunces` (serif, bold/extrabold)
- Cuerpo: `DM Sans` (sans-serif)

### Principios:
- Mobile-first (muchos docentes usarán celular)
- Formulario ultra simple — "tan fácil como llenar un formulario del Ministerio"
- Cero jerga de IA visible al docente
- Accesibilidad obligatoria (la app es de educación inclusiva)

---

## 🛡️ REGLAS DE NEGOCIO

### Límites de plan:
| Plan | Guías/mes | Historial | PDF | Guardar | Precio |
|------|-----------|-----------|-----|---------|--------|
| Free | 2 | ❌ | ❌ | ❌ | $0 |
| Pro | 40 | ✅ | ✅ | ✅ | $9.900/mes |
| Institucional | ∞ | ✅ | ✅ | ✅ | $29.900/mes (futuro) |

### Reglas:
1. El contador de consultas se resetea el 1° de cada mes
2. Si el plan Pro vence, el usuario vuelve a Free automáticamente
3. El webhook de Mercado Pago es la única fuente de verdad para activar planes
4. Los datos del docente NUNCA aparecen en logs de errores
5. Rate limiting: máximo 5 requests por minuto por usuario al endpoint de Claude
6. La respuesta de IA debe empezar a aparecer en menos de 3 segundos (streaming)

---

## 🔐 SEGURIDAD

1. **RLS activado** en todas las tablas de Supabase — cada docente solo ve sus datos
2. **Validar en el servidor** siempre — nunca confiar en el cliente
3. **API Key de Claude** solo en el servidor (nunca exponerla)
4. **Webhook de Mercado Pago:** verificar firma, usar service role key
5. **Sanitizar** todos los inputs del formulario antes de enviarlos a Claude
6. **No loguear** datos personales del docente
7. **CORS** correctamente configurado

---

## 📝 CONVENCIONES DE CÓDIGO

```
- TypeScript estricto (strict: true)
- Archivos: kebab-case (mi-componente.tsx) excepto componentes React (PascalCase)
- Imports: paths absolutos con @ (ej: @/lib/types)
- Componentes: functional con hooks, nunca class components
- Estado global: Context API para auth y plan (no Redux)
- Estilo: Tailwind utility classes, componentes shadcn/ui
- Errores: try/catch con mensajes amigables al usuario
- Comentarios: solo donde la lógica no es obvia
- Console.log: eliminar todos antes de producción
```

---

## 🧪 TESTING MANUAL — CASOS CLAVE

Después de cada fase, verificá estos escenarios:

1. **Docente nuevo:** Registro → login → ver /inicio con plan free
2. **Primera guía:** Formulario completo → generar → ver streaming → copiar
3. **Límite free:** Generar 2 guías → al intentar la 3ra → PaywallModal
4. **Pago:** Click "Suscribirme" → Mercado Pago → webhook → plan Pro activado
5. **Post-pago:** Generar guía 3 → funciona → guardar en historial → funciona
6. **Caso extremo:** Primario rural + TEA + Discapacidad intelectual + sin apoyo → la guía generada debe ser concreta y útil
7. **Mobile:** Todo el flujo desde un celular → formulario usable → resultado legible
8. **Accesibilidad:** Navegar con Tab → todos los elementos accesibles

---

## 🚨 ERRORES COMUNES A EVITAR

1. **NO** hardcodear datos que ya están en `/data/` — siempre importar
2. **NO** usar `any` en TypeScript — tipar todo
3. **NO** guardar la API key de Claude en el cliente
4. **NO** olvidar el middleware de auth en rutas protegidas
5. **NO** asumir que Mercado Pago siempre responde — manejar timeouts
6. **NO** hacer el formulario en una sola página — son 3 pasos obligatorios
7. **NO** mostrar la respuesta de Claude en texto plano — parsear markdown
8. **NO** olvidar resetear el contador mensual de consultas
9. **NO** enviar datos del formulario sin sanitizar al prompt de Claude
10. **NO** usar localStorage para datos sensibles — usar Supabase

---

## ✅ CRITERIOS DE ACEPTACIÓN FINAL

La app está lista para producción cuando:

- [ ] Un docente puede registrarse, loguearse y completar el formulario en menos de 3 minutos
- [ ] La guía generada es concreta, específica y útil (no genérica)
- [ ] El streaming funciona y la respuesta empieza a aparecer en <3 segundos
- [ ] El plan free limita correctamente a 2 guías/mes
- [ ] Mercado Pago cobra correctamente y activa el plan Pro
- [ ] El historial funciona para usuarios Pro
- [ ] La app funciona perfectamente en celular
- [ ] Los contrastes cumplen WCAG AA
- [ ] No hay errores en la consola del navegador
- [ ] El deploy en Vercel está funcionando con dominio configurado
