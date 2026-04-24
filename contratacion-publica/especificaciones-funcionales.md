# Especificaciones Funcionales y No Funcionales — IncluAI

Anexo I del Pliego Técnico Modelo. Este documento detalla los requisitos funcionales (RF) y no funcionales (RNF) que IncluAI cumple actualmente o se compromete a cumplir dentro de la implementación.

---

## 1. Requisitos Funcionales (RF)

### RF-01 — Gestión de usuarios y roles
- **RF-01.1** El sistema debe soportar los roles: Docente, Equipo de Orientación / Apoyo, Equipo Directivo, Supervisión Escolar, Referente Ministerial, Administrador del sistema.
- **RF-01.2** Cada rol tendrá permisos diferenciados para ver, crear, editar y exportar información.
- **RF-01.3** El Administrador ministerial podrá dar de alta escuelas, docentes y estudiantes de forma masiva (carga CSV).
- **RF-01.4** El sistema debe permitir suspender o dar de baja usuarios sin perder el historial.

### RF-02 — Planificación de clase asistida por IA
- **RF-02.1** El docente podrá generar una planificación de clase indicando: nivel, área, contenido curricular, tipo(s) de discapacidad o configuración de apoyo del/los estudiantes, duración de la clase, recursos disponibles.
- **RF-02.2** La IA devolverá en menos de 30 segundos una propuesta estructurada con: objetivos, secuencia didáctica, estrategias inclusivas específicas, materiales sugeridos, criterios de evaluación, adaptaciones por tipo de discapacidad.
- **RF-02.3** El docente podrá editar libremente el resultado, guardarlo como borrador o marcarlo como definitivo.
- **RF-02.4** El sistema mantendrá un historial versionado de cada planificación.

### RF-03 — Gestión de PPI (Propuesta Pedagógica para la Inclusión)
- **RF-03.1** El sistema proveerá una plantilla PPI conforme Res. CFE 311/16.
- **RF-03.2** Campos mínimos: datos del estudiante (anonimizables para exportación), equipo interviniente, configuración de apoyo, acuerdos con familia, adecuaciones curriculares (de acceso o significativas), seguimiento.
- **RF-03.3** La IA podrá asistir al docente proponiendo borradores de adecuaciones que luego el equipo revisa.

### RF-04 — Biblioteca de recursos
- **RF-04.1** Biblioteca curada de estrategias inclusivas por tipo de discapacidad, con citas bibliográficas verificables.
- **RF-04.2** Recursos multimedia (imágenes, videos con subtítulos, audios) organizados por área y nivel.
- **RF-04.3** Posibilidad de que el docente aporte recursos propios y los comparta con colegas de su escuela.

### RF-05 — Adaptación de materiales
- **RF-05.1** Lectura fácil: simplificación de textos conservando sentido.
- **RF-05.2** Descripción de imágenes para estudiantes con discapacidad visual.
- **RF-05.3** Conversión de texto a audio.
- **RF-05.4** Generación de subtítulos en español rioplatense neutro.

### RF-06 — Panel directivo y supervisión
- **RF-06.1** Tablero agregado con: cantidad de planificaciones generadas, distribución por discapacidad, escuelas más activas, docentes por nivel de uso.
- **RF-06.2** Toda métrica visible en niveles agregados es anonimizada. No se exponen datos individuales de estudiantes a roles superiores sin trazabilidad.
- **RF-06.3** Alertas configurables (por ejemplo: escuelas sin actividad por más de 30 días).

### RF-07 — Reportes
- **RF-07.1** Exportación a PDF firmable de planificaciones y PPI.
- **RF-07.2** Exportación a hoja de cálculo (XLSX/CSV) de reportes agregados.
- **RF-07.3** Reporte de impacto trimestral automático para el Ministerio.

### RF-08 — Capacitación integrada
- **RF-08.1** Módulo de auto-capacitación en formato microlearning.
- **RF-08.2** Certificados digitales descargables al completar trayectos.
- **RF-08.3** Integración opcional con el Instituto Nacional de Formación Docente (INFoD) si la provincia lo coordina.

### RF-09 — Integraciones
- **RF-09.1** API REST documentada con OpenAPI 3.0.
- **RF-09.2** Capacidad de exportar datos al sistema provincial de gestión educativa si existe (ej: GEI en provincias que lo implementan).
- **RF-09.3** Single Sign-On (SSO) opcional con el directorio del ministerio vía SAML 2.0 u OAuth 2.0.

---

## 2. Requisitos No Funcionales (RNF)

### RNF-01 — Disponibilidad
- Uptime mínimo garantizado: **99.5% mensual** (ver SLA).
- Ventanas de mantenimiento programado fuera del horario escolar (22:00–05:00 ART) con aviso de 72 horas.

### RNF-02 — Rendimiento
- Tiempo de carga inicial (Time to Interactive) < 3 segundos en conexión 4G promedio.
- Respuesta de generación IA < 30 segundos en el percentil 95.
- Soporte concurrente: hasta 10.000 docentes activos simultáneos por jurisdicción, escalable horizontalmente.

### RNF-03 — Escalabilidad
- Arquitectura preparada para crecer de 1 escuela piloto a cobertura provincial completa sin migración.
- Base de datos con índices y particionamiento adecuado para volúmenes de 1M+ registros.

### RNF-04 — Seguridad
- Cifrado TLS 1.2+ en tránsito.
- Cifrado en reposo para datos sensibles (AES-256 o equivalente).
- Row Level Security (RLS) a nivel de base de datos Postgres (Supabase).
- 2FA disponible para todos los usuarios.
- Log de auditoría inmutable con retención mínima 5 años.
- Pentests anuales por terceros independientes con informe resumido disponible al cliente.

### RNF-05 — Accesibilidad
- WCAG 2.1 AA verificado con herramientas automáticas (axe-core, Lighthouse) y auditoría manual.
- Testing con usuarios reales con discapacidad como parte del ciclo de desarrollo.
- Soporte de lectores de pantalla: NVDA, JAWS, VoiceOver, TalkBack.

### RNF-06 — Usabilidad
- Interfaz disponible en español rioplatense neutro como idioma principal.
- Onboarding guiado al primer ingreso.
- Ayuda contextual en cada pantalla.
- Modo oscuro opcional.

### RNF-07 — Compatibilidad
- Navegadores soportados: Chrome, Firefox, Edge y Safari en sus dos últimas versiones estables.
- Responsive: tablet y mobile funcionales (la experiencia óptima es desktop/tablet).

### RNF-08 — Protección de datos
- Residencia declarada de los datos.
- Acuerdo de tratamiento de datos (DPA) firmado.
- Política de no uso de datos del cliente para entrenar modelos, salvo consentimiento explícito y revocable.
- Mecanismo de exportación total de datos (portabilidad) en formato abierto si el cliente da de baja el servicio.
- Borrado seguro documentado al finalizar la relación contractual.

### RNF-09 — Trazabilidad de IA
- Cada output generado por IA queda registrado con: timestamp, modelo utilizado, prompt (hash), usuario que lo solicitó.
- El docente ve siempre una leyenda "generado con IA, revise antes de aplicar en aula".
- Mecanismo de reporte de outputs problemáticos disponible en un click.

### RNF-10 — Mantenimiento y evolución
- Ventanas de release ordenadas (no los viernes, no en fin de trimestre escolar).
- Changelog público visible para los administradores ministeriales.
- Roadmap compartido trimestralmente con el cliente.

### RNF-11 — Soporte
- Ver `sla.md` — Acuerdo de Nivel de Servicio.

### RNF-12 — Reversibilidad
- El Ministerio puede solicitar exportación completa de sus datos en cualquier momento.
- En caso de baja, período de gracia de 90 días para recuperación de datos antes del borrado definitivo.
- No hay lock-in técnico: los datos se entregan en formatos abiertos (CSV, JSON).

---

## 3. Matriz de cumplimiento

| Código | Estado IncluAI | Comentario |
|---|---|---|
| RF-01 a RF-08 | Cumplido | Funcionalidad nativa de la plataforma |
| RF-09 (SSO SAML) | Parcial — compromiso de entrega en 60 días si se adjudica | Requiere implementación específica |
| RNF-01 a RNF-08 | Cumplido | Verificable en sandbox |
| RNF-09 (trazabilidad IA) | Cumplido | Registros disponibles en panel de administración |
| RNF-12 | Cumplido | Política de exportación documentada |

---

*Documento emitido por Nativos Consultora Digital, titular Jorge Eduardo Francesia, proveedor de IncluAI (incluai.com.ar).*
