export interface Subproceso {
  id: string;
  nombre: string;
  lider: string;
}

export interface Macroproceso {
  id: string;
  nombre: string;
  nivel: 'Estratégico' | 'Misional' | 'Apoyo' | 'Evaluación';
  subprocesos: Subproceso[];
}

export const macroprocesos: Macroproceso[] = [
  {
    id: 'direccionamiento-estrategico',
    nombre: 'Direccionamiento Estratégico',
    nivel: 'Estratégico',
    subprocesos: [
      { id: 'banco-programas', nombre: 'Banco de Programas y Proyectos', lider: 'Secretario(a) de Planeación' },
      { id: 'mejoramiento-institucional', nombre: 'Gestión para el Mejoramiento Institucional', lider: 'Secretario(a) de Planeación' },
      { id: 'ordenamiento-territorial', nombre: 'Ordenamiento Territorial', lider: 'Secretario(a) de Planeación' },
      { id: 'cooperacion-internacional', nombre: 'Cooperación Internacional', lider: 'Jefe Oficina de Gestión para la Cooperación' },
      { id: 'gestion-presupuestal', nombre: 'Gestión Presupuestal', lider: 'Secretario(a) de Hacienda' },
    ],
  },
  {
    id: 'info-comunicaciones',
    nombre: 'Gestión de la Información y las Comunicaciones',
    nivel: 'Estratégico',
    subprocesos: [
      { id: 'comunicacion-publica', nombre: 'Comunicación Pública', lider: 'Jefe Asesor de Comunicaciones de Prensa' },
      { id: 'tecnologias-informacion', nombre: 'Tecnologías de la Información', lider: 'Jefe Oficina de TIC' },
    ],
  },
  {
    id: 'servicios-salud',
    nombre: 'Gestión de Servicios de Salud',
    nivel: 'Misional',
    subprocesos: [
      { id: 'aseguramiento-salud', nombre: 'Aseguramiento en Salud', lider: 'Secretario(a) de Salud' },
      { id: 'salud-publica', nombre: 'Salud Pública', lider: 'Secretario(a) de Salud' },
      { id: 'salud-ambiental', nombre: 'Salud Ambiental', lider: 'Secretario(a) de Salud' },
      { id: 'defensa-derechos', nombre: 'Defensa de los Derechos de los Ciudadanos', lider: 'Secretario(a) de Salud' },
    ],
  },
  {
    id: 'gestion-educativa',
    nombre: 'Gestión Educativa',
    nivel: 'Misional',
    subprocesos: [
      { id: 'calidad-educativa', nombre: 'Calidad Educativa', lider: 'Secretario(a) de Educación' },
      { id: 'cobertura-educativa', nombre: 'Cobertura Educativa', lider: 'Secretario(a) de Educación' },
      { id: 'inspeccion-vigilancia', nombre: 'Inspección y Vigilancia Educativa', lider: 'Secretario(a) de Educación' },
    ],
  },
  {
    id: 'convivencia-seguridad',
    nombre: 'Convivencia Ciudadana, Seguridad y Orden Público',
    nivel: 'Misional',
    subprocesos: [
      { id: 'convivencia-cultura', nombre: 'Convivencia y Cultura Ciudadana', lider: 'Secretario(a) de Gobierno' },
      { id: 'gestion-riesgo-desastres', nombre: 'Gestión de Riesgo de Desastres', lider: 'Secretario(a) de Gobierno' },
      { id: 'victimas', nombre: 'Víctimas', lider: 'Secretario(a) de Gobierno' },
      { id: 'movilidad-seguridad-vial', nombre: 'Gestión de Movilidad y Seguridad Vial', lider: 'Secretario(a) de Tránsito' },
    ],
  },
  {
    id: 'desarrollo-social',
    nombre: 'Desarrollo Social Integral y Ambiental del Territorio',
    nivel: 'Misional',
    subprocesos: [
      { id: 'vivienda-saneamiento', nombre: 'Gestión de Vivienda y Saneamiento Básico', lider: 'Secretario(a) de Vivienda' },
      { id: 'gestion-cultural', nombre: 'Gestión Cultural', lider: 'Secretario(a) de Cultura' },
      { id: 'gestion-turistica', nombre: 'Gestión Turística', lider: 'Secretario(a) de Turismo' },
      { id: 'comunidades-etnicas', nombre: 'Gestión para las Comunidades Étnicas', lider: 'Secretario(a) de Asuntos Étnicos' },
      { id: 'espacios-publicos', nombre: 'Mantenimiento Espacios de Uso Público e Infraestructura Vial', lider: 'Secretario(a) de Infraestructura Física' },
      { id: 'sostenibilidad-ambiental', nombre: 'Sostenibilidad Ambiental y Minera', lider: 'Secretario(a) de Ambiente' },
      { id: 'atencion-social', nombre: 'Atención Social y Participación Ciudadana', lider: 'Secretario(a) de Desarrollo Social' },
      { id: 'desarrollo-agropecuario', nombre: 'Desarrollo Agropecuario', lider: 'Secretario(a) de Agricultura' },
      { id: 'posconflicto', nombre: 'Gestión para el Posconflicto', lider: 'Jefe Unidad de Posconflicto' },
    ],
  },
  {
    id: 'gestion-financiera',
    nombre: 'Gestión Financiera',
    nivel: 'Apoyo',
    subprocesos: [
      { id: 'tesoreria', nombre: 'Tesorería', lider: 'Tesorero(a)' },
      { id: 'fiscalizacion', nombre: 'Fiscalización', lider: 'Secretario(a) de Hacienda' },
      { id: 'contabilidad-general', nombre: 'Contabilidad General', lider: 'Secretario(a) de Hacienda' },
    ],
  },
  {
    id: 'gestion-catastral',
    nombre: 'Gestión Catastral',
    nivel: 'Apoyo',
    subprocesos: [
      { id: 'actualizacion-catastral', nombre: 'Actualización catastral', lider: 'Secretario(a) de Hacienda' },
      { id: 'conservacion-catastral', nombre: 'Conservación catastral', lider: 'Secretario(a) de Hacienda' },
    ],
  },
  {
    id: 'gestion-administrativa',
    nombre: 'Gestión Administrativa',
    nivel: 'Apoyo',
    subprocesos: [
      { id: 'atencion-ciudadano', nombre: 'Atención al Ciudadano', lider: 'Secretario(a) General' },
      { id: 'gestion-documental', nombre: 'Gestión Documental (Archivo y Ventanilla Única)', lider: 'Secretario(a) General' },
      { id: 'administracion-galeria', nombre: 'Administración Galería', lider: 'Secretario(a) General' },
      { id: 'inventarios-bienes', nombre: 'Gestión de Inventarios de Bienes Muebles e Inmuebles', lider: 'Secretario(a) de Gestión Institucional' },
    ],
  },
  {
    id: 'talento-humano',
    nombre: 'Gestión del Talento Humano',
    nivel: 'Apoyo',
    subprocesos: [
      { id: 'admin-talento-humano', nombre: 'Administración del Talento Humano', lider: 'Secretario(a) de Gestión Institucional' },
      { id: 'seguridad-salud-trabajo', nombre: 'Seguridad y Salud en el Trabajo', lider: 'Secretario(a) de Gestión Institucional' },
      { id: 'control-disciplinario', nombre: 'Control disciplinario', lider: 'Jefe Oficina de Control Interno Disciplinario' },
    ],
  },
  {
    id: 'gestion-juridica',
    nombre: 'Gestión Jurídica',
    nivel: 'Apoyo',
    subprocesos: [
      { id: 'gestion-contractual', nombre: 'Gestión contractual', lider: 'Secretario(a) Jurídico' },
      { id: 'defensa-judicial', nombre: 'Defensa judicial', lider: 'Secretario(a) Jurídico' },
      { id: 'juzgamiento-disciplinario', nombre: 'Juzgamiento disciplinario', lider: 'Secretario(a) Jurídico' },
    ],
  },
  {
    id: 'gestion-estadistica',
    nombre: 'Gestión Estadística',
    nivel: 'Apoyo',
    subprocesos: [
      { id: 'gestion-sisben', nombre: 'Gestión del Sisbén', lider: 'Secretario(a) de Planeación' },
      { id: 'informacion-estadistica', nombre: 'Información Estadística', lider: 'Secretario(a) de Planeación' },
    ],
  },
  {
    id: 'control-interno',
    nombre: 'Control Interno',
    nivel: 'Evaluación',
    subprocesos: [
      { id: 'evaluacion-gestion', nombre: 'Evaluación a la Gestión', lider: 'Jefe Asesor de Control Interno' },
    ],
  },
];

export function getMacroprocesosByNivel(nivel: string): Macroproceso[] {
  return macroprocesos.filter(m => m.nivel === nivel);
}

export function findMacroproceso(id: string): Macroproceso | undefined {
  return macroprocesos.find(m => m.id === id);
}

export function findSubproceso(id: string): Subproceso | undefined {
  for (const m of macroprocesos) {
    const s = m.subprocesos.find(sp => sp.id === id);
    if (s) return s;
  }
  return undefined;
}
