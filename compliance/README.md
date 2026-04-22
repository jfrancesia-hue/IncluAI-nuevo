# Compliance IncluIA

**Empresa titular:** Nativos Consultora Digital S.A.S.
**Producto:** IncluIA — Plataforma SaaS de educación inclusiva con Inteligencia Artificial
**Dominio:** https://incluia.com.ar
**Contacto Compliance:** compliance@incluia.com.ar
**Responsable de Protección de Datos (DPO):** dpo@incluia.com.ar
**Fecha de última revisión general:** 22 de abril de 2026
**Versión del dossier:** 1.0

---

## Propósito

Este directorio concentra toda la documentación de cumplimiento normativo, accesibilidad, privacidad, seguridad de la información y ética de IA de IncluIA. Está diseñado para ser presentado ante:

- Áreas de Compliance de Ministerios de Educación provinciales (en particular Córdoba, como primera jurisdicción objetivo).
- Auditores externos de seguridad y privacidad.
- Inversores en rondas de due diligence.
- La Agencia de Acceso a la Información Pública (AAIP) de la Nación Argentina.

Cada documento está redactado para ser interpretable de forma autónoma, aunque se recomienda comenzar la lectura por este índice.

---

## Normativa de referencia

IncluIA se diseña y opera cumpliendo con el siguiente marco normativo argentino e internacional:

| Norma | Ámbito | Aplicabilidad |
|-------|--------|---------------|
| Ley 25.326 de Protección de Datos Personales | Nacional Argentina | Aplica a todos los datos personales tratados |
| Decreto Reglamentario 1558/2001 | Nacional Argentina | Reglamenta la Ley 25.326 |
| Ley 26.653 de Accesibilidad de la Información en las Páginas Web | Nacional Argentina | Obligatoria para proveedores del Estado |
| Ley 26.206 de Educación Nacional | Nacional Argentina | Marco del sistema educativo argentino |
| Ley 26.378 (ratificación de la Convención sobre los Derechos de las Personas con Discapacidad) | Nacional Argentina | Derecho a la educación inclusiva (Art. 24) |
| Resolución CFE 311/16 | Consejo Federal de Educación | Promoción, acreditación, certificación y titulación de estudiantes con discapacidad |
| Resolución CFE 174/12 | Consejo Federal de Educación | Unidad pedagógica primer ciclo |
| WCAG 2.1 nivel AA | Estándar W3C | Accesibilidad de la plataforma web |
| ISO/IEC 27001:2022 | Estándar internacional | Sistema de Gestión de Seguridad de la Información (en hoja de ruta) |
| ISO/IEC 27701:2019 | Estándar internacional | Gestión de privacidad (extensión de ISO 27001) |

---

## Estructura del directorio

```
/compliance/
├── README.md                                   Este archivo (índice)
│
├── wcag-2.1-aa/                                Accesibilidad web
│   ├── audit-report.md                         Auditoría criterio por criterio WCAG 2.1 AA
│   └── remediation-plan.md                     Plan de remediación con owners y fechas
│
├── ley-25326-datos-personales/                 Protección de datos personales
│   ├── registro-aaip.md                        Procedimiento de registro de bases ante la AAIP
│   ├── politica-privacidad.md                  Política de privacidad publicable
│   └── consentimiento-menores.md               Flujo de consentimiento y tratamiento de datos de menores
│
├── ley-26653-accesibilidad/                    Accesibilidad normativa argentina
│   └── declaracion-conformidad.md              Declaración de conformidad nivel AA
│
├── cfe-311-16/                                 Resolución CFE 311/16
│   └── mapeo-funcionalidad-normativa.md        Mapeo de funcionalidades IncluIA a artículos CFE 311/16
│
├── iso-27001/                                  Seguridad de la información
│   └── roadmap-implementacion.md               Hoja de ruta 12 meses a certificación
│
└── auditoria-sesgos-ia/                        Ética de IA
    ├── metodologia.md                          Metodología de auditoría de sesgos
    └── resultados-iniciales.md                 Resultados del primer ciclo de auditoría
```

---

## Índice navegable de documentos

### 1. Accesibilidad Web — WCAG 2.1 AA
- [Informe de auditoría WCAG 2.1 AA](./wcag-2.1-aa/audit-report.md)
- [Plan de remediación WCAG 2.1 AA](./wcag-2.1-aa/remediation-plan.md)

### 2. Protección de Datos Personales — Ley 25.326
- [Procedimiento de registro de bases de datos ante la AAIP](./ley-25326-datos-personales/registro-aaip.md)
- [Política de Privacidad de IncluIA](./ley-25326-datos-personales/politica-privacidad.md)
- [Consentimiento informado y tratamiento de datos de menores](./ley-25326-datos-personales/consentimiento-menores.md)

### 3. Accesibilidad de la Información — Ley 26.653
- [Declaración de Conformidad de Accesibilidad nivel AA](./ley-26653-accesibilidad/declaracion-conformidad.md)

### 4. Educación Inclusiva — Resolución CFE 311/16
- [Mapeo de funcionalidades de IncluIA a artículos de la Resolución CFE 311/16](./cfe-311-16/mapeo-funcionalidad-normativa.md)

### 5. Seguridad de la Información — ISO/IEC 27001
- [Hoja de ruta de implementación ISO 27001 (12 meses)](./iso-27001/roadmap-implementacion.md)

### 6. Auditoría de Sesgos de IA
- [Metodología de auditoría de sesgos del modelo Claude](./auditoria-sesgos-ia/metodologia.md)
- [Resultados del primer ciclo de auditoría](./auditoria-sesgos-ia/resultados-iniciales.md)

---

## Estado general del programa de compliance

| Dominio | Estado | Responsable | Próxima revisión |
|---------|--------|-------------|------------------|
| WCAG 2.1 AA | Parcialmente conforme (87% criterios) | Equipo Frontend + QA Accesibilidad | 2026-07-15 |
| Ley 25.326 | Conforme con observaciones menores | DPO | 2026-06-30 |
| Ley 26.653 | Declaración en proceso | DPO + Legal | 2026-05-20 |
| CFE 311/16 | Mapeo completo, en validación con expertas pedagógicas | Producto + Asesora Pedagógica | 2026-06-10 |
| ISO 27001 | En implementación (Mes 2 de 12) | CTO + CISO externo | Mensual |
| Auditoría de sesgos | Primer ciclo completado, ciclo 2 en curso | Equipo de IA + Asesora en Educación Especial | Trimestral |

---

## Gobierno del programa

- **Comité de Compliance:** se reúne mensualmente. Integrado por CEO, CTO, DPO, Legal externo y Asesora Pedagógica en Educación Especial.
- **Ciclo de revisión documental:** cada documento de esta carpeta se revisa al menos una vez por año o ante cambios sustantivos del producto o la normativa.
- **Control de versiones:** todos los documentos de este directorio están versionados en el repositorio principal de IncluIA. Los cambios requieren pull request y aprobación del DPO o CTO según corresponda.

---

## Contacto

| Rol | Email | Responsabilidad |
|-----|-------|-----------------|
| DPO (Responsable de Protección de Datos) | dpo@incluia.com.ar | Ley 25.326, derechos ARCO, AAIP |
| CISO | seguridad@incluia.com.ar | ISO 27001, incidentes, vulnerabilidades |
| Accesibilidad | accesibilidad@incluia.com.ar | WCAG, Ley 26.653 |
| Compliance general | compliance@incluia.com.ar | Coordinación y canal único |
| Legal | legal@incluia.com.ar | Contratos con organismos públicos |
