# IncluIA v2.1 — Plan de implementación

## Qué hay en este paquete

Tres archivos pensados para trabajar con Claude Code de forma ordenada y sin mezclar contextos:

| Archivo | Scope | Cuándo usarlo |
|---|---|---|
| `1-CAMBIOS-AGENTE.md` | Backend, prompt, schemas, API | Sesión de Claude Code dedicada al agente |
| `2-CAMBIOS-FRONTEND.md` | React, componentes, estilos, UX | Sesión de Claude Code dedicada al frontend |
| `guia-biomas-rediseñada.html` | Prototipo visual de referencia | Material de consulta visual durante las dos sesiones |

---

## Por qué están separados

Mezclar cambios de agente y de frontend en una sola sesión de Claude Code es la forma más rápida de romper todo. Los cambios de agente tocan schemas que, si cambiás a mitad del frontend, te rompen los tipos TypeScript. Y viceversa: si el frontend cambia la estructura esperada antes de que el agente la soporte, te rompe en producción.

La secuencia correcta es:

1. **Implementar primero el agente** (documento 1)
2. **Desplegar a staging y validar** que devuelve JSON correctamente
3. **Implementar después el frontend** (documento 2) consumiendo ese JSON
4. **Hacer el switch v1 → v2.1** solo cuando ambas partes están verdes

---

## Decisión importante sobre imágenes y videos

En el documento de agente vas a ver que **Claude NO genera imágenes ni embebe videos directamente**. En su lugar:

- **Para imágenes**: Claude genera un `query` en inglés y el backend lo resuelve contra la API gratuita de Unsplash. Por qué: imágenes reales, profesionales, gratis, consistentes. Alternativa a futuro: tu propio banco fotográfico (ver brief audiovisual v2.0).
- **Para videos**: Claude genera referencias a canales oficiales (Canal Encuentro, Pakapaka, Nat Geo) con queries de búsqueda. Solo incluye URLs/embeds cuando está seguro de que existen, para no destruir la confianza del docente con links rotos.

Esta arquitectura es la que usan Duolingo, Khan Academy y las edtech serias del mundo. Es más robusta, más rápida, y escala sin fricción.

---

## Cómo usarlo con Claude Code

### Sesión 1 — Agente

Abrí Claude Code con el proyecto y pasale:

```
Contexto inicial obligatorio:
1. Leé docs/DESIGN.md y docs/GUIA-VISUAL.md (ya existen)
2. Leé docs/DESIGN-V2.md (de la entrega anterior)
3. Leé docs/1-CAMBIOS-AGENTE.md (scope de esta sesión)

Tu tarea para esta sesión:
Implementar todos los cambios del documento 1, siguiendo el orden
recomendado. NO toques componentes de frontend, solo backend,
schemas, prompts y API routes.

Antes de empezar, validá los criterios de aceptación al final
del documento. Después hacé una rama llamada feat/agente-v2.1
y trabajá toda la sesión ahí.
```

### Sesión 2 — Frontend

Cuando la sesión 1 esté mergeada y andando, abrí otra sesión con:

```
Contexto inicial obligatorio:
1. Leé docs/DESIGN.md y docs/GUIA-VISUAL.md (ya existen)
2. Leé docs/DESIGN-V2.md (de la entrega anterior)
3. Leé docs/2-CAMBIOS-FRONTEND.md (scope de esta sesión)
4. Abrí docs/guia-biomas-rediseñada.html como referencia visual

Tu tarea para esta sesión:
Implementar todos los cambios del documento 2, siguiendo el orden
recomendado. NO toques el agente ni los prompts, solo componentes
React, hooks, estilos y páginas.

Tenés que consumir el schema GuiaPedagogicaSchema ya implementado
por la sesión anterior. Si algo del schema no está claro, consultá
antes de implementar.

Al terminar, validá TODOS los criterios de aceptación, especialmente
los de accesibilidad y mobile.
```

---

## Checklist de entrega final

Cuando ambas sesiones estén terminadas:

- [ ] Generar una guía de prueba con un caso conocido (ej: biomas)
- [ ] Verificar que las imágenes cargan de Unsplash
- [ ] Verificar que los videos abren en modal
- [ ] Probar la barra de accesibilidad (tamaños de texto + contraste)
- [ ] Probar imprimir la guía
- [ ] Probar en mobile real (no solo en DevTools)
- [ ] Probar con una consulta vieja (v1 markdown) para confirmar que el fallback funciona
- [ ] Pedir feedback a una docente real (validación cualitativa)

---

## Próximos pasos después de v2.1

Una vez validado v2.1 con docentes reales, los siguientes hitos naturales son:

1. **Agregar micro-animaciones** con Framer Motion en las transiciones de acordeón
2. **Migrar de Unsplash a banco propio** con las fotos del brief audiovisual
3. **Agregar el módulo Familias** con la misma arquitectura estructurada
4. **Agregar el módulo Profesionales** con la misma arquitectura estructurada
5. **Tests E2E con Playwright** para blindar la experiencia

---

Fin del README de implementación · IncluIA v2.1
