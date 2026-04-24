# Consentimiento informado y tratamiento de datos de menores

**Producto:** IncluAI
**Norma principal:** Ley 25.326 (Art. 7, datos sensibles; Art. 10 bis, consentimiento), Convención sobre los Derechos del Niño (Ley 23.849), Ley 26.061 de Protección Integral de Derechos de Niños, Niñas y Adolescentes, Ley 26.378 (Convención sobre los Derechos de las Personas con Discapacidad).
**Versión:** 1.0
**Última revisión:** 22 de abril de 2026
**Responsable:** Dr. Martín Castagnino (DPO)

---

## Principio de diseño estructural: "Datos de estudiantes NUNCA se cargan individualmente"

La decisión de diseño más importante de IncluAI desde el punto de vista de protección de datos es la siguiente:

> **IncluAI no permite cargar, almacenar, procesar ni visualizar datos personales identificatorios de estudiantes (menores de edad).**

Esta decisión es **el pilar legal y ético** que protege a IncluAI, a los docentes usuarios, a las instituciones educativas contratantes y fundamentalmente a los niños, niñas y adolescentes (NNyA) de quienes se habla en contextos pedagógicos dentro de la plataforma.

Esta política convierte la mayor parte de las preocupaciones habituales de EdTech en no aplicables a IncluAI: **no tratamos datos sensibles de menores porque no los tenemos**.

---

## 1. Categorías de datos que nunca se cargan ni se aceptan

La plataforma bloquea técnica y normativamente la carga de:

- Nombre y apellido del estudiante.
- DNI / CUIL del estudiante.
- Fotografías, grabaciones de audio o video del estudiante.
- Diagnósticos médicos individualizados firmados por profesionales.
- Certificados Únicos de Discapacidad (CUD) individualizados.
- Domicilio, teléfono, email u otros datos de contacto.
- Nombres de familiares, docentes particulares u otras personas del entorno.
- Calificaciones o desempeño académico identificables.
- Información genética, biométrica, de salud mental o cualquier dato sensible conforme Art. 7 Ley 25.326.

---

## 2. Qué sí se procesa y cómo se estructura

Para que IncluAI pueda cumplir su propósito pedagógico sin tratar datos personales de menores, el docente describe **contextos pedagógicos genéricos**, no personas.

Ejemplo de descripción aceptable (anonimizada):

> "Un estudiante de 4° grado con Trastorno del Espectro Autista nivel 1, con alto interés en trenes y dificultades en lectura comprensiva. Planificar actividad de 40 minutos sobre el ciclo del agua adaptada."

Ejemplo de descripción **NO aceptable** (bloqueada por la plataforma):

> "Juan Pérez, DNI 56.123.456, alumno de 4° grado, CUD vigente con diagnóstico TEA firmado por el Dr. González..."

La plataforma detecta patrones como números de DNI, nombres completos seguidos de datos, y muestra una advertencia modal al docente indicando que no debe cargar esos datos.

---

## 3. Controles técnicos implementados

### 3.1. Controles preventivos (frontend)

- Placeholder instructivo en el campo de descripción del contexto del estudiante: "Describí el contexto pedagógico sin nombres, DNI ni datos identificatorios."
- Banner informativo persistente en el editor que recuerda la política.
- Tutorial obligatorio al primer uso que enseña cómo describir situaciones sin identificar alumnos.

### 3.2. Controles de detección (backend)

- **Filtro de DNI/CUIL:** regex que detecta formatos `XX.XXX.XXX`, `XXXXXXXX`, `XX-XXXXXXXX-X` y bloquea el envío con mensaje de error pedagógico ("Detectamos un posible DNI. Por favor describí el contexto sin identificar al estudiante.").
- **Detección de nombres propios con heurística:** si el texto contiene patrones "Nombre Apellido edad X años" con frecuencia inusual, se solicita confirmación.
- **Clasificador de PII:** capa de middleware antes de enviar a Claude que corre un detector ligero de PII con umbral conservador.

### 3.3. Controles en el prompt a Claude

El prompt de sistema enviado a Claude incluye una instrucción explícita:

> "Si detectás datos personales identificatorios de estudiantes (nombres, DNI, fotos, diagnósticos individuales firmados) en el pedido del usuario, respondé indicándole que no debe cargar esa información y pedile que reformule el contexto de forma anonimizada. No proceses la solicitud hasta que el pedido esté correctamente anonimizado."

Este control funciona como defensa en profundidad en caso de que los controles previos fallen.

### 3.4. Controles de auditoría

- Los logs de prompts se anonimizan tras 30 días.
- Auditoría trimestral en muestra aleatoria de prompts para verificar que no se filtraron datos personales de menores.
- Si se detecta filtración, se purga inmediatamente y se investiga el flujo que permitió el bypass.

---

## 4. Consentimiento informado del docente

Al registrarse, el docente debe aceptar una cláusula específica que explica esta política:

### Texto de consentimiento (al momento del registro)

> **Compromiso de uso responsable**
>
> Al registrarme en IncluAI declaro que comprendo y acepto que:
>
> 1. IncluAI es una herramienta para generar guías pedagógicas inclusivas a partir de descripciones genéricas de contextos educativos.
> 2. **Me comprometo a NO cargar en la plataforma datos personales identificatorios de ningún estudiante, tales como nombres, apellidos, DNI, fotografías, diagnósticos individuales firmados, domicilios o cualquier otro dato que permita identificar a un niño, niña o adolescente.**
> 3. Entiendo que describir un "contexto pedagógico" implica hablar en términos generales y anonimizados ("un estudiante de tercer grado con discapacidad auditiva") y no de individuos concretos.
> 4. Comprendo que la plataforma incluye controles automatizados para bloquear la carga de datos personales, pero la responsabilidad final del contenido que ingreso es mía como docente profesional.
> 5. Asumo que cualquier tratamiento de datos personales de alumnos concretos debe realizarse por fuera de IncluAI, dentro del marco normativo que corresponda a mi institución educativa (Ley 26.206, Resolución CFE 311/16, política de privacidad del establecimiento).
>
> ☐ Leí y acepto el compromiso anterior.
>
> ☐ Leí y acepto la [Política de Privacidad](../politica-privacidad.md) y los [Términos y Condiciones](../../terminos.md).

El checkbox es obligatorio y no está pre-marcado (cumple principio de consentimiento libre, informado y específico de la Ley 25.326).

---

## 5. ¿Y si el docente igual carga datos personales de un alumno?

Si ocurre que un docente ignora las advertencias y logra cargar información personal de un estudiante (por ejemplo, escribiendo un nombre propio creíble que los filtros no detectaron):

### Responsabilidad
- La responsabilidad primaria recae en el docente que ignoró los términos aceptados.
- Nativos Consultora Digital no actúa como responsable del tratamiento de ese dato, sino como plataforma con controles razonables.
- No obstante, asumimos responsabilidad operativa de detectar y purgar.

### Procedimiento de respuesta
1. El DPO abre ticket y revisa el contenido.
2. Se purgan el prompt original, la respuesta generada y cualquier copia en logs.
3. Se notifica al docente con indicación clara del incumplimiento y recordatorio de sus obligaciones.
4. Reincidencia = suspensión de la cuenta.
5. Si se considera que hubo violación de derechos del NNyA, se notifica a la autoridad educativa correspondiente.

### Documentación del incidente
El incidente se registra en `/compliance/incidentes/YYYY-MM-DD-XX.md` (carpeta privada no publicada), incluyendo cronología, acciones tomadas y lecciones aprendidas.

---

## 6. Fase 8 — Módulo Gobierno (datos agregados)

El módulo Gobierno (previsto para Fase 8 del roadmap) provee dashboards a Ministerios provinciales con estadísticas agregadas. En este módulo:

- **Nunca se exponen datos individuales** de docentes ni de estudiantes.
- Se aplica umbral k-anónimo: ninguna métrica se muestra si N<15.
- Solo se muestran agregados del tipo: "El 72% de docentes de Córdoba que planificaron clases para alumnos con TEA utilizaron el protocolo de refuerzo positivo en abril 2026".
- No existe posibilidad técnica de desagregar a nivel escuela, docente o estudiante desde el módulo de gobierno.

Este diseño técnico es **una garantía estructural** al Ministerio contratante de que la plataforma no expone datos personales y, por tanto, no le genera responsabilidad de co-tratamiento.

---

## 7. Marco normativo de respaldo

- **Ley 25.326, Art. 7:** los datos sensibles (incluidos los relativos a salud y discapacidad) sólo pueden tratarse con consentimiento expreso y escrito. **IncluAI elude este artículo no tratando datos sensibles individualizados.**
- **Ley 26.061, Art. 22:** derecho a la intimidad y a la propia imagen de NNyA. **IncluAI respeta este derecho por diseño.**
- **Convención sobre los Derechos del Niño, Art. 16:** protección contra injerencias arbitrarias en la vida privada.
- **Resolución CFE 311/16:** promueve trayectorias educativas inclusivas. Las guías generadas por IncluAI apoyan esta resolución sin requerir datos individualizados.

---

## 8. Declaración final

Nativos Consultora Digital S.A.S. declara que IncluAI, por diseño, no recolecta, almacena ni procesa datos personales identificatorios de estudiantes menores de edad. Esta declaración se sostiene tanto en términos normativos (consentimiento y políticas) como técnicos (controles preventivos, detectivos y correctivos).

Esta política será revisada al menos una vez al año y ante cualquier cambio sustantivo en el producto.

---

**Aprobado por:**

- Dr. Martín Castagnino — DPO — 2026-04-22
- Lic. Lucía Fernández — CEO — 2026-04-22
- Prof. Carolina Ledesma — Asesora Pedagógica en Educación Especial — 2026-04-22
