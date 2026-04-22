# Pliego de Bases y Condiciones Técnicas — Modelo

## Contratación de Plataforma de Apoyo a la Planificación de Clases Inclusivas con Inteligencia Artificial

**Expediente:** [EXP-EDU-AAAA-NNNNNN]
**Organismo contratante:** Ministerio de Educación de la Provincia de [PROVINCIA]
**Modalidad sugerida:** Contratación Directa por especialidad (art. correspondiente del régimen provincial) o Licitación Privada, según monto. El presente pliego es adaptable a ambas modalidades.
**Plazo:** 12 meses prorrogables por hasta 24 meses adicionales

---

## 1. Objeto

Contratar el servicio de licenciamiento por suscripción (SaaS) de una plataforma digital de apoyo a docentes para la planificación de clases inclusivas dirigidas a estudiantes con discapacidad o configuraciones de apoyo, que utilice inteligencia artificial generativa para producir propuestas pedagógicas adaptadas, alineadas con el Diseño Curricular Jurisdiccional y la Resolución CFE 311/16.

## 2. Marco normativo

El servicio deberá cumplir con:

- **Ley 26.206** — Ley de Educación Nacional, en particular Capítulo VIII (Educación Especial) y principio de educación inclusiva.
- **Ley 26.378** — Aprobación de la Convención Internacional sobre los Derechos de las Personas con Discapacidad (ONU, art. 24 sobre educación).
- **Resolución CFE N° 311/16** — Trayectoria educativa integral de estudiantes con discapacidad, Propuesta Pedagógica para la Inclusión (PPI) y certificación.
- **Ley 25.326** — Protección de Datos Personales (tratamiento de datos de menores y datos sensibles de salud).
- **Decreto 1558/01** — Reglamentario de la Ley 25.326.
- **Disposición DNPDP 11/2006** — Medidas de seguridad para archivos de datos personales.
- **Ley Micaela (Ley 27.499)** — En la medida en que aplique al personal de capacitación.
- Normativa provincial de protección de datos y acceso a la información pública que corresponda.
- Régimen provincial de contrataciones aplicable.

## 3. Alcance del servicio

### 3.1 Licenciamiento
Acceso por suscripción mensual o anual a la plataforma web, sin instalación local, con licencias nominales por docente y cómputo por estudiante beneficiado.

### 3.2 Funcionalidades mínimas exigidas
El oferente debe proveer al menos:

1. **Generación asistida por IA** de planificaciones de clase adaptadas, a partir de:
   - Nivel educativo (inicial, primario, secundario)
   - Área curricular
   - Tipo(s) de discapacidad o configuración de apoyo (visual, auditiva, intelectual, motora, TEA, TDAH, otras)
   - Contenido curricular objetivo
2. **Biblioteca de estrategias inclusivas** por tipo de discapacidad, con referencias bibliográficas verificables.
3. **Adaptación de materiales didácticos** existentes (lectura fácil, subtítulos, descripción de imágenes, audio).
4. **Gestión de PPI** (Propuesta Pedagógica para la Inclusión) con campos mínimos según Res. CFE 311/16.
5. **Panel para equipo directivo y supervisión** con métricas agregadas anonimizadas.
6. **Reportes exportables** en PDF y hoja de cálculo.
7. **Historial versionado** de planificaciones por estudiante y por grupo.
8. **Control de acceso por rol**: docente, equipo de apoyo, dirección, supervisión, administración ministerial.

### 3.3 Capacitación
El oferente deberá proveer un plan de capacitación inicial (mínimo 4 horas sincrónicas + material asincrónico) para:
- Docentes titulares de grado/año
- Equipos técnicos de orientación escolar
- Equipos directivos
- Referentes ministeriales

### 3.4 Soporte
Ver Anexo III — Acuerdo de Nivel de Servicio (SLA).

## 4. Requisitos técnicos exigidos

### 4.1 Arquitectura
- Servicio entregado como SaaS multi-tenant con segregación lógica por jurisdicción.
- Hosting en proveedores con cumplimiento SOC 2 Tipo II o equivalente. El oferente debe declarar la región de alojamiento de datos.
- API REST documentada con OpenAPI 3.0 para integraciones futuras.

### 4.2 Accesibilidad
- **WCAG 2.1 nivel AA** como mínimo en toda la interfaz.
- Compatibilidad con lectores de pantalla (NVDA, JAWS, VoiceOver).
- Navegación completa por teclado.
- Alto contraste y modo oscuro.
- Tipografías ampliables sin pérdida de contenido hasta 200%.

### 4.3 Seguridad
- Autenticación con contraseña robusta + opción de segundo factor (2FA).
- Cifrado en tránsito: TLS 1.2 o superior.
- Cifrado en reposo para datos sensibles.
- **Row Level Security (RLS)** a nivel de base de datos: cada docente accede solo a sus estudiantes asignados.
- Log de auditoría inmutable con registro de accesos, modificaciones y exportaciones.
- Política de contraseñas alineada con OWASP ASVS Level 2.
- Backups automáticos diarios con retención mínima de 30 días y prueba de restauración trimestral documentada.

### 4.4 Protección de datos personales
- Cumplimiento de Ley 25.326 y disposiciones AAIP.
- Designación de responsable de protección de datos (DPO) por parte del oferente.
- Acuerdo de tratamiento de datos (DPA) incluido en el contrato.
- Cláusula específica de tratamiento de datos de menores de edad.
- Procedimiento de ejercicio de derechos ARCO-P (acceso, rectificación, cancelación, oposición, portabilidad).

### 4.5 Uso responsable de IA
- Declaración jurada del oferente sobre:
  - Modelos de IA utilizados y proveedores (ej: Anthropic Claude, OpenAI, etc.)
  - Política de no entrenamiento con datos del cliente sin consentimiento explícito
  - Mecanismo de revisión humana obligatoria antes de que una planificación sea aplicada en aula
  - Manejo de sesgos y límites de la IA comunicados al docente en la interfaz

## 5. Condiciones del oferente

### 5.1 Antecedentes mínimos
- Persona humana o jurídica con domicilio legal en la República Argentina.
- Inscripción en AFIP activa.
- Libre deuda previsional y tributaria al momento de adjudicación.
- Al menos una experiencia documentada en desarrollo de software educativo o plataformas con IA aplicada a educación.

### 5.2 Documentación a presentar con la oferta
1. Propuesta técnica detallada que responda punto por punto a este pliego
2. Propuesta económica según Anexo II (Presupuesto Modelo)
3. Declaración jurada de cumplimiento de Ley 25.326 y uso responsable de IA
4. Constancia de inscripción AFIP y Ingresos Brutos de la jurisdicción
5. Certificado fiscal para contratar (AFIP RG 4164/17 o vigente)
6. Referencias de al menos un cliente previo en el sector educativo, público o privado (si existieran)
7. Demostración funcional del producto: acceso sandbox por 15 días para el equipo evaluador, sin costo

## 6. Criterios de evaluación

La evaluación será integral y ponderada:

| Dimensión | Ponderación | Qué se evalúa |
|---|---|---|
| Calidad técnica de la solución | 35% | Cumplimiento de requisitos RF/RNF, usabilidad, accesibilidad |
| Propuesta pedagógica | 20% | Alineación con Res. CFE 311/16, calidad de outputs generados |
| Precio | 25% | Razonabilidad frente a Anexo II, descuentos por volumen |
| Soporte y SLA | 10% | Tiempos de respuesta, plan de capacitación |
| Antecedentes y solvencia | 10% | Experiencia, referencias, capacidad técnica |

La oferta más económica **no es automáticamente adjudicataria**. Prevalece la oferta más conveniente.

## 7. Anexos

- Anexo I: Especificaciones funcionales detalladas (ver `especificaciones-funcionales.md`)
- Anexo II: Presupuesto Modelo (ver `presupuesto-modelo-por-estudiante.md`)
- Anexo III: Acuerdo de Nivel de Servicio (ver `sla.md`)
- Anexo IV: Modelo de convenio (ver `modelo-convenio-provincia.md`)

---

*Documento modelo provisto por Nativos Consultora Digital para uso de áreas de Compras del Estado. Adapte los campos entre corchetes a su jurisdicción antes de publicar.*
