export interface NavItem {
  icon: string;
  label: string;
  route: string;
}

export interface ModuleDef {
  id: string;
  icon: string;
  color: string;
  colorClass: string;
  description: string;
  title: string;
  nav: NavItem[];
}

export const modules: ModuleDef[] = [
  {
    id: 'ISMS',
    icon: 'Shield',
    color: '#22C55E',
    colorClass: 'green',
    description: 'Seguridad de la información',
    title: 'Gestión de riesgos de seguridad de la información',
    nav: [
      { icon: 'home', label: 'Dashboard', route: '/isms' },
      { icon: 'git-branch', label: 'Procesos', route: '/isms/procesos' },
      { icon: 'server', label: 'Activos', route: '/isms/activos/nuevo' },
      { icon: 'file-text', label: 'Documentos', route: '/isms/documentos' },
      { icon: 'zap', label: 'Riesgos', route: '/isms/riesgos' },
      { icon: 'alert-triangle', label: 'Amenazas', route: '/isms/amenazas' },
      { icon: 'sliders', label: 'Controles', route: '/isms/controles' },
      { icon: 'flag', label: 'Incidentes', route: '/isms/incidentes' },
      { icon: 'clipboard', label: 'Planes', route: '/isms/planes' },
      { icon: 'bar-chart-2', label: 'Reportes', route: '/isms/reportes' },
      { icon: 'trending-up', label: 'Indicadores', route: '/isms/indicadores' },
      { icon: 'check-square', label: 'Evaluaciones', route: '/isms/evaluaciones' }
    ]
  },
  {
    id: 'Compliance',
    icon: 'Scale',
    color: '#EF4444',
    colorClass: 'red',
    description: 'Riesgos normativos',
    title: 'Gestión de riesgos normativos',
    nav: [
      { icon: 'home', label: 'Dashboard', route: '/compliance' },
      { icon: 'git-branch', label: 'Procesos', route: '/compliance/procesos' },
      { icon: 'book-open', label: 'Normas', route: '/compliance/normas' },
      { icon: 'file-text', label: 'Documentos', route: '/compliance/documentos' },
      { icon: 'zap', label: 'Riesgos', route: '/compliance/riesgos' },
      { icon: 'link', label: 'Causas', route: '/compliance/causas' },
      { icon: 'sliders', label: 'Controles', route: '/compliance/controles' },
      { icon: 'bell', label: 'Eventos', route: '/compliance/eventos' },
      { icon: 'clipboard', label: 'Planes', route: '/compliance/planes' },
      { icon: 'bar-chart-2', label: 'Reportes', route: '/compliance/reportes' },
      { icon: 'trending-up', label: 'Indicadores', route: '/compliance/indicadores' },
      { icon: 'check-square', label: 'Evaluaciones', route: '/compliance/evaluaciones' }
    ]
  },
  {
    id: 'ORM',
    icon: 'Cog',
    color: '#F4B400',
    colorClass: 'yellow',
    description: 'Riesgos operacionales',
    title: 'Gestión de riesgos operativos',
    nav: [
      { icon: 'home', label: 'Dashboard', route: '/orm' },
      { icon: 'git-branch', label: 'Procesos', route: '/orm/procesos' },
      { icon: 'file-text', label: 'Documentos', route: '/orm/documentos' },
      { icon: 'zap', label: 'Riesgos', route: '/orm/riesgos' },
      { icon: 'link', label: 'Causas', route: '/orm/causas' },
      { icon: 'sliders', label: 'Controles', route: '/orm/controles' },
      { icon: 'bell', label: 'Eventos', route: '/orm/eventos' },
      { icon: 'clipboard', label: 'Planes', route: '/orm/planes' },
      { icon: 'bar-chart-2', label: 'Reportes', route: '/orm/reportes' },
      { icon: 'trending-up', label: 'Indicadores', route: '/orm/indicadores' },
      { icon: 'check-square', label: 'Evaluaciones', route: '/orm/evaluaciones' },
      { icon: 'dollar-sign', label: 'Capital', route: '/orm/capital' }
    ]
  },
  {
    id: 'AML',
    icon: 'Search',
    color: '#8B5CF6',
    colorClass: 'purple',
    description: 'Antilavado de dinero',
    title: 'Gestión de riesgos antilavado de dinero',
    nav: [
      { icon: 'home', label: 'Dashboard', route: '/aml' },
      { icon: 'git-branch', label: 'Procesos', route: '/aml/procesos' },
      { icon: 'search', label: 'Factores', route: '/aml/factores' },
      { icon: 'file-text', label: 'Documentos', route: '/aml/documentos' },
      { icon: 'zap', label: 'Riesgos', route: '/aml/riesgos' },
      { icon: 'link', label: 'Causas', route: '/aml/causas' },
      { icon: 'sliders', label: 'Controles', route: '/aml/controles' },
      { icon: 'bell', label: 'Alertas', route: '/aml/alertas' },
      { icon: 'clipboard', label: 'Planes', route: '/aml/planes' },
      { icon: 'bar-chart-2', label: 'Reportes', route: '/aml/reportes' },
      { icon: 'trending-up', label: 'Indicadores', route: '/aml/indicadores' },
      { icon: 'check-square', label: 'Evaluaciones', route: '/aml/evaluaciones' }
    ]
  },
  {
    id: 'Auditorías',
    icon: 'ClipboardCheck',
    color: '#3B82F6',
    colorClass: 'blue',
    description: 'Gestión de auditorías',
    title: 'Gestión de auditorías',
    nav: [
      { icon: 'home', label: 'Dashboard', route: '/auditoria' },
      { icon: 'git-branch', label: 'Procesos', route: '/auditoria/procesos' },
      { icon: 'file-text', label: 'Documentos', route: '/auditoria/documentos' },
      { icon: 'zap', label: 'Riesgos', route: '/auditoria/riesgos' },
      { icon: 'globe', label: 'Universo Auditable', route: '/auditoria/universo' },
      { icon: 'clipboard', label: 'Programas', route: '/auditoria/programas' },
      { icon: 'check-square', label: 'Remediación', route: '/auditoria/remediacion' },
      { icon: 'bar-chart-2', label: 'Reportes', route: '/auditoria/reportes' },
      { icon: 'trending-up', label: 'Indicadores', route: '/auditoria/indicadores' }
    ]
  }
];

let activeModuleId = $state('ISMS');
let showModulePicker = $state(false);
let activeRoute = $state('/' + modules[0].nav[0].route);

export const navStore = {
  get activeModuleId() { return activeModuleId; },
  set activeModuleId(v: string) { activeModuleId = v; },

  get showModulePicker() { return showModulePicker; },
  set showModulePicker(v: boolean) { showModulePicker = v; },

  get activeRoute() { return activeRoute; },
  set activeRoute(v: string) { activeRoute = v; },

  get activeModule() {
    return modules.find(m => m.id === activeModuleId) ?? modules[0];
  },

  get otherModules() {
    return modules.filter(m => m.id !== activeModuleId);
  },

  setModule(id: string) {
    activeModuleId = id;
    showModulePicker = false;
    const mod = modules.find(m => m.id === id);
    if (mod) {
      activeRoute = mod.nav[0].route;
    }
  },

  setRoute(route: string) {
    activeRoute = route;
  },

  togglePicker() {
    showModulePicker = !showModulePicker;
  },

  moduleFromPath(path: string) {
    const seg = path.split('/')[1]?.toLowerCase() || '';
    const map: Record<string, string> = {
      isms: 'ISMS', compliance: 'Compliance', orm: 'ORM', aml: 'AML', auditoria: 'Auditorías',
    };
    const id = map[seg];
    return modules.find(m => m.id === id) ?? null;
  }
};
