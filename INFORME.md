# Informe de Avance — SRIESGO

## 1. Estado del Proyecto

| Componente | Estado | Detalle |
|---|---|---|
| Backend (NestJS + Prisma + PostgreSQL) | ✅ Funcional | `localhost:3001` |
| Frontend (Svelte 5 + Runes) | ✅ Funcional | `localhost:5173` |
| Autenticación | ✅ Funcional | JWT con login `admin@entidad.gov.co` / `Admin123!` |
| Build | ✅ Pasa | `npm run build` sin errores |

---

## 2. Icon System

### Reemplazo de lucide-svelte por componente local
- **`src/lib/ui/Icon.svelte`** — componente que renderiza SVG inline por nombre
- **`src/lib/ui/icon-data.ts`** — 30+ iconos definidos: `file-text`, `clipboard-list`, `bar-chart-3`, `activity`, `sliders`, `check-circle`, `list`, `map-pin`, `line-chart`, `refresh-cw`, `search`, `users`, `settings`, `shield`, `book-open`, `clipboard-check`, `database`, `eye`, `file-warning`, `flag`, `folder`, `git-branch`, `globe`, `help-circle`, `home`, `info`, `layers`, `lock`, `log-out`, `menu`, `minus`, `more-horizontal`, `plus`, `trash-2`, `upload`, `x`
- **Card.svelte** — prop `icon` cambiada de tipo componente (`any`) a `string` (nombre del icono)
- **Sin dependencias externas de iconos** — todos los SVGs son inline

---

## 3. Páginas Rediseñadas (Card + DataTable + Icon)

### Módulo de Riesgos
| Ruta | Estado | Descripción |
|---|---|---|
| `/riesgos` | ✅ Completo | DataTable con fila expandible (detalle + responsables + controles), formulario inline de creación |
| `/riesgos/nuevo` | ✅ Completo | Wizard multi-paso con validación por paso, Icon + Card |

### Módulo de Controles
| Ruta | Estado | Descripción |
|---|---|---|
| `/controles` | ✅ Completo | DataTable con botones de editar/eliminar usando funciones globales `window.*` |

### Módulo de Reportes
| Ruta | Estado | Descripción |
|---|---|---|
| `/reportes` | ✅ Completo | Diseño en 3 columnas con Cards: riesgos por proceso, por dependencia, altos |

### Módulo de Activos
| Ruta | Estado | Descripción |
|---|---|---|
| `/activos/nuevo` | ✅ Completo | Wizard con 4 pasos, selects anidados (dependencia → macroproceso → proceso → subproceso), 8 SVGs reemplazados por `<Icon>` |

### Páginas Placeholder (23 páginas)
Todas con diseño moderno (Card + Icon + mensaje "próximamente"):

- `/usuarios`, `/roles`, `/dependencias`, `/procesos`
- `/mapa-calor`, `/evaluaciones`, `/auditoria`
- `/dashboard`, `/dashboard/operativo`, `/dashboard/estrategico`, `/dashboard/cumplimiento`
- `/activos`, `/activos/[id]`
- `/controles/nuevo`, `/controles/[id]`
- `/riesgos/[id]`
- `/reportes/por-proceso`, `/reportes/por-dependencia`, `/reportes/consolidado`
- `/metodologia`, `/politicas`, `/configuracion`

---

## 4. Matriz de Procesos

### Página `/procesos` — Visor Jerárquico
- **Fuente de datos**: API en vivo (ya no usa datos estáticos)
- Agrupación por nivel: **Estratégico**, **Misional**, **Apoyo**, **Evaluación**
- Colores por nivel (azul, verde, ámbar, púrpura)
- Buscador en tiempo real
- Filtro por nivel (botones tipo chip)
- Cada macroproceso muestra las dependencias responsables
- Tabla con procesos, códigos y subprocesos
- Card de resumen con conteos

### Base de Datos — Seed (45 procesos, 22 subprocesos)

**3 dependencias nuevas**:
| Dependencia | Macroprocesos asociados |
|---|---|
| Oficina de Control Interno Disciplinario | Gestión del Talento Humano |
| Secretaría de Gestión Institucional | Gestión Administrativa, Gestión del Talento Humano |
| Oficina de Control Interno | Control Interno |

**Macroprocesos por Nivel**:

| Nivel | Macroprocesos | Procesos |
|---|---|---|
| **ESTRATÉGICO** | Direccionamiento Estratégico, Gestión de la Información y las Comunicaciones, Gestión Financiera | 7 |
| **MISIONAL** | Desarrollo Social Integral y Ambiental del Territorio, Convivencia Ciudadana Seguridad y Orden Público, Gestión de Servicios de Salud, Gestión Educativa | 20 |
| **APOYO** | Gestión Administrativa, Gestión Catastral, Gestión Financiera, Talento Humano, Gestión Jurídica, Gestión Estadística, Gestión Documental, Comunicación Pública | 17 |
| **EVALUACIÓN** | Control Interno | 1 |

**22 subprocesos** creados para procesos clave (TIC, PQRSDF, Talento Humano, Gestión Contractual, Evaluación, Banco de Programas, Gestión Documental, Seguridad y Salud, Catastro, etc.)

---

## 5. Decisiones Técnicas

| Decisión | Detalle |
|---|---|
| **DataTable column render** | Usa `{@html}` con strings HTML + funciones globales `window.*` para botones de acción (edit/delete), registradas en `onMount` y limpiadas en destroy |
| **Matriz de procesos** | Los "Subprocesos" del PDF se mapearon al modelo Prisma `Proceso`; se añadieron registros `Subproceso` como granularidad más fina para procesos clave |
| **Cascada de selects** | Dependencia → Macroproceso (filtrado por `dependenciaId`) → Proceso (filtrado por `macroprocesoId`) → Subproceso (cargado vía API `subprocesos.findByProceso`) |
| **Timeout API** | 15s `AbortController` en todas las peticiones |

---

## 6. Pendientes / Próximos Pasos

- [ ] Verificar que todas las páginas placeholder redirijan correctamente
- [ ] Implementar formularios de creación/edición en páginas placeholder
- [ ] Conectar el visor de la matriz de procesos con los filtros de selección en formularios
- [ ] Validar que la creación de activos funcione con la cascada completa de selects
- [ ] Probar flujo completo: login → crear riesgo → asociar control → generar reporte
