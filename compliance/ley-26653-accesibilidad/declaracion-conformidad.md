# Declaración de Conformidad de Accesibilidad Nivel AA

**Conforme a la Ley 26.653 de Accesibilidad de la Información en las Páginas Web**
**y estándar WCAG 2.1 nivel AA**

---

## 1. Identificación del emisor

- **Razón social:** Nativos Consultora Digital S.A.S.
- **CUIT:** 30-71234567-8
- **Producto declarado:** IncluIA — https://incluia.com.ar
- **Responsable de Accesibilidad:** Mariana Pérez — accesibilidad@incluia.com.ar
- **Fecha de emisión:** 22 de abril de 2026
- **Vigencia:** 12 meses desde la fecha de emisión, sujeta a revisiones en caso de cambios sustantivos.

---

## 2. Norma de referencia

La presente declaración se enmarca en:

- **Ley Nacional 26.653** (promulgada el 3 de noviembre de 2010) de Accesibilidad de la Información en las Páginas Web, que obliga a los organismos del Sector Público Nacional, empresas privadas concesionarias de servicios públicos, empresas prestadoras o contratistas de bienes y servicios y las entidades privadas a las que se les haya otorgado subsidios o aportes provenientes del Sector Público Nacional, a respetar en los diseños de sus páginas web las normas y requisitos sobre accesibilidad de la información que faciliten el acceso a sus contenidos a todas las personas con discapacidad.
- **Decreto Reglamentario 355/2013** que reglamenta la Ley 26.653.
- **Disposición ONTI 6/2019** y sus actualizaciones, que adopta las Web Content Accessibility Guidelines 2.1 del W3C como estándar técnico de referencia para el cumplimiento de la Ley 26.653.
- **WCAG 2.1 del World Wide Web Consortium (W3C)** — Recomendación de 5 de junio de 2018.

---

## 3. Nivel declarado

Nivel de conformidad declarado: **Parcialmente conforme con WCAG 2.1 nivel AA**.

Esta declaración se basa en la auditoría interna documentada en [audit-report.md](../wcag-2.1-aa/audit-report.md), que relevó los 50 criterios de nivel A y AA:

- 43 criterios conformes (86%)
- 4 criterios parcialmente conformes (8%)
- 2 criterios incumplidos (4%)
- 1 criterio no aplicable (2%)

Los incumplimientos y conformidades parciales cuentan con un plan de remediación con fechas comprometidas, que llevará la conformidad al 100% AA para el **15 de julio de 2026**. Ver [remediation-plan.md](../wcag-2.1-aa/remediation-plan.md).

---

## 4. Alcance de la declaración

Esta declaración aplica a:

- La totalidad de las páginas públicas del dominio https://incluia.com.ar
- La aplicación autenticada bajo https://incluia.com.ar/app
- Los correos electrónicos transaccionales enviados por IncluIA (en formato HTML accesible y alternativa de texto plano).
- La documentación de soporte en https://incluia.com.ar/ayuda.

Se excluye de esta declaración:

- Contenido generado por usuarios (guías pedagógicas que los docentes crean) — en este caso, la plataforma provee herramientas para crear contenido accesible pero la responsabilidad editorial es del docente.
- Servicios de terceros integrados (por ejemplo, el checkout de Mercado Pago), cuya accesibilidad es responsabilidad del proveedor.

---

## 5. Metodología de evaluación

La auditoría se realizó combinando:

1. **Pruebas automatizadas** con axe-core 4.10, Lighthouse 12 y WAVE.
2. **Pruebas manuales** con teclado, zoom 200%, alto contraste, reducción de movimiento.
3. **Pruebas con tecnología asistiva:** NVDA 2025.1, VoiceOver (macOS 15), TalkBack (Android 15).
4. **Pruebas con usuarios reales:** 2 docentes con baja visión, 1 docente con discapacidad motriz (usa switch), 1 docente usuaria de lector de pantalla.

Detalles en [audit-report.md](../wcag-2.1-aa/audit-report.md).

---

## 6. Características de accesibilidad implementadas

IncluIA implementa, entre otras, las siguientes características:

- **Navegación completa por teclado** en todos los flujos, incluyendo el editor de guías pedagógicas.
- **Foco visible** con indicador de 2px de alto contraste en todos los elementos interactivos.
- **Semántica HTML5 correcta** con landmarks, encabezados jerárquicos y roles ARIA apropiados.
- **Compatibilidad con lectores de pantalla** NVDA, JAWS, VoiceOver y TalkBack.
- **Contraste de colores** conforme a WCAG AA (4.5:1 en texto normal, 3:1 en texto grande) en la mayor parte de la interfaz.
- **Redimensionado del texto** hasta 200% sin pérdida de contenido ni funcionalidad.
- **Etiquetas de formulario** asociadas correctamente a sus campos, con mensajes de error descriptivos.
- **Alternativas textuales** en todos los contenidos no textuales informativos.
- **Subtítulos y transcripciones** en todo el contenido multimedia educativo.
- **Skip links** ("Saltar al contenido principal") en todas las páginas.
- **Idioma declarado** (`lang="es-AR"`) y partes en otros idiomas marcadas.
- **Respeto a preferencias del usuario** como `prefers-reduced-motion`, `prefers-color-scheme`.
- **Páginas responsive** sin scroll horizontal hasta 320px de ancho.
- **Tipografía accesible:** Inter Variable, validada con docentes con dislexia.

---

## 7. Limitaciones conocidas

A la fecha de emisión de esta declaración persisten las siguientes limitaciones, en proceso de remediación:

| ID | Limitación | Impacto | Fecha de resolución |
|----|------------|---------|---------------------|
| RM-05 | Selector de tipo de discapacidad no totalmente accesible a lectores de pantalla | Alto — afecta un flujo crítico | 2026-05-05 |
| RM-06 | Mensajes de confirmación (toasts) no anunciados a tecnología asistiva | Medio | 2026-05-07 |
| RM-02 | Contraste insuficiente en placeholders del editor | Medio | 2026-05-10 |
| RM-04 | Mensajes de error de CUIL sin sugerencia de formato | Medio | 2026-05-12 |
| RM-01 | Atributos `autocomplete` faltantes en algunos campos | Bajo | 2026-05-15 |
| RM-03 | Contraste de bordes de input en estado normal | Bajo | 2026-05-20 |

---

## 8. Mecanismos de retroalimentación

Los usuarios pueden reportar problemas de accesibilidad y solicitar contenido en formatos alternativos a través de:

- **Correo electrónico:** accesibilidad@incluia.com.ar
- **Formulario web:** https://incluia.com.ar/accesibilidad/contacto
- **Teléfono:** +54 351 456 7890 (horario laboral Argentina)

Nos comprometemos a responder toda solicitud dentro de las 48 horas hábiles y a emitir una respuesta sustantiva en un plazo máximo de 10 días hábiles.

---

## 9. Compromiso de mejora continua

Nativos Consultora Digital S.A.S. se compromete a:

1. Mantener y mejorar la accesibilidad de IncluIA de forma continua.
2. Realizar auditorías anuales internas y externas.
3. Capacitar al equipo de desarrollo y diseño en WCAG y buenas prácticas de accesibilidad.
4. Integrar pruebas de accesibilidad automatizadas en el pipeline de CI.
5. Incorporar usuarios con discapacidad en el proceso de investigación de usuario (UX research) de forma sistemática.
6. Comunicar a los usuarios cualquier cambio sustantivo en el nivel de conformidad.

---

## 10. Procedimiento ante incumplimientos

Si un usuario considera que IncluIA no cumple con los requisitos de accesibilidad de la Ley 26.653 y el reclamo al canal interno no obtiene respuesta satisfactoria, puede presentar denuncia ante:

- **Oficina Nacional de Tecnologías de Información (ONTI):** Av. Roque Sáenz Peña 511, Ciudad Autónoma de Buenos Aires.
- **Autoridad de Aplicación de la Ley 26.653** (actualmente la Secretaría de Innovación Pública, según Decreto 50/2019).

---

## 11. Publicación

Esta declaración está publicada en https://incluia.com.ar/accesibilidad y se actualiza al menos anualmente o ante cambios sustantivos.

Versión vigente: 1.0
Próxima revisión prevista: 22 de abril de 2027 (o antes ante cambios sustantivos).

---

## 12. Firmas

**Mariana Pérez**
Responsable de Accesibilidad
Nativos Consultora Digital S.A.S.
accesibilidad@incluia.com.ar

**Sebastián Martínez**
Director de Tecnología (CTO)
Nativos Consultora Digital S.A.S.
cto@incluia.com.ar

**Lucía Fernández**
Directora Ejecutiva (CEO) y representante legal
Nativos Consultora Digital S.A.S.
ceo@incluia.com.ar

Córdoba, 22 de abril de 2026.
