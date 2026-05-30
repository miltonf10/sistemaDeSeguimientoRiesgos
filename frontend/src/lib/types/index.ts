export type Rol = 'ADMINISTRADOR' | 'LIDER_PROCESO' | 'AUDITOR' | 'CONSULTA';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  cargo: string | null;
  rol: Rol;
  activo: boolean;
  dependenciaId: string | null;
  dependencia: { id: string; nombre: string } | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    rol: Rol;
    dependencia: string | null;
  };
}

export interface Dependencia {
  id: string;
  nombre: string;
  codigo: string | null;
  activo: boolean;
}

export interface Macroproceso {
  id: string;
  nombre: string;
  dependenciaId: string;
  activo: boolean;
  dependencia?: Dependencia;
  procesos?: Proceso[];
}

export interface Subproceso {
  id: string;
  nombre: string;
  procesoId: string;
  activo: boolean;
  proceso?: Proceso;
}

export interface Proceso {
  id: string;
  nombre: string;
  nivel: string;
  objetivo: string | null;
  codigo: string | null;
  macroprocesoId: string;
  macroproceso?: Macroproceso;
}

export interface Activo {
  id: string;
  identificador: string | null;
  nombre: string;
  tipo: string;
  subTipo: string | null;
  descripcion: string | null;
  macroprocesoId: string | null;
  macroproceso?: Macroproceso;
  procesoId: string | null;
  proceso?: Proceso;
  subprocesoId: string | null;
  subprocesoRel?: Subproceso;
  dependenciaId: string;
  dependencia?: Dependencia;
  codigoGestionDocumental: string | null;
  serieDocumental: string | null;
  subserieDocumental: string | null;
  responsableId: string;
  responsable?: Usuario;
  propietarioCargo: string | null;
  custodioCargo: string | null;
  fechaGeneracion: string | null;
  fechaIngresoArchivo: string | null;
  soporteRegistro: string | null;
  medioConservacion: string | null;
  formato: string | null;
  idioma: string | null;
  confidencialidad: string | null;
  valorC: number | null;
  integridad: string | null;
  valorI: number | null;
  disponibilidad: string | null;
  valorD: number | null;
  criticidad: string | null;
  informacionPublicada: boolean | null;
  lugarConsulta: string | null;
  objetoLegitimoExcepcion: string | null;
  fundamentoConstitucionalLegal: string | null;
  fundamentoJuridicoExcepcion: string | null;
  excepcionTotalParcial: string | null;
  fechaClasificacion: string | null;
  tiempoClasificacion: string | null;
  contieneDatosPersonales: boolean | null;
  contieneDatosMenores: boolean | null;
  tiposDatosPersonales: string | null;
  finalidadTratamiento: string | null;
  existeAutorizacionTratamiento: boolean | null;
  activo: boolean;
}

export interface Riesgo {
  id: string;
  nombre: string;
  causa: string;
  consecuencia: string;
  clasificacion: string;
  estado: string;
  procesoId: string;
  proceso?: Proceso;
  activoId: string;
  activo?: Activo;
  evaluaciones?: EvaluacionRiesgo[];
}

export interface EvaluacionRiesgo {
  id: string;
  riesgoId: string;
  probabilidad: number;
  impacto: number;
  riesgoInherente: number;
  riesgoResidual: number | null;
  nivelResidual: string | null;
  evaluadoPorId: string;
  fechaEvaluacion: string;
  observaciones: string | null;
  controles?: Control[];
}

export interface Control {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipoControl: string;
  frecuencia: string;
  eficacia: number;
  responsableId: string;
  responsable?: Usuario;
  evaluacionId: string;
}
