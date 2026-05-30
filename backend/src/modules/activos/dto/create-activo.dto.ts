import { IsString, IsOptional, IsInt, Min, Max, IsBoolean, IsDateString } from 'class-validator';

export class CreateActivoDto {
  // Identificación
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  identificador?: string;

  @IsString()
  tipo: string;

  @IsString()
  @IsOptional()
  subTipo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  // Organización
  @IsString()
  @IsOptional()
  macroprocesoId?: string;

  @IsString()
  @IsOptional()
  procesoId?: string;

  @IsString()
  @IsOptional()
  subprocesoId?: string;

  @IsString()
  dependenciaId: string;

  // Gestión documental
  @IsString()
  @IsOptional()
  codigoGestionDocumental?: string;

  @IsString()
  @IsOptional()
  serieDocumental?: string;

  @IsString()
  @IsOptional()
  subserieDocumental?: string;

  // Responsables
  @IsString()
  responsableId: string;

  @IsString()
  @IsOptional()
  propietarioCargo?: string;

  @IsString()
  @IsOptional()
  custodioCargo?: string;

  // Fechas
  @IsDateString()
  @IsOptional()
  fechaGeneracion?: string;

  @IsDateString()
  @IsOptional()
  fechaIngresoArchivo?: string;

  // Características técnicas
  @IsString()
  @IsOptional()
  soporteRegistro?: string;

  @IsString()
  @IsOptional()
  medioConservacion?: string;

  @IsString()
  @IsOptional()
  formato?: string;

  @IsString()
  @IsOptional()
  idioma?: string;

  // Clasificación ISO 27001
  @IsString()
  @IsOptional()
  confidencialidad?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  valorC?: number;

  @IsString()
  @IsOptional()
  integridad?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  valorI?: number;

  @IsString()
  @IsOptional()
  disponibilidad?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  valorD?: number;

  @IsString()
  @IsOptional()
  criticidad?: string;

  // Información clasificada y reservada
  @IsBoolean()
  @IsOptional()
  informacionPublicada?: boolean;

  @IsString()
  @IsOptional()
  lugarConsulta?: string;

  @IsString()
  @IsOptional()
  objetoLegitimoExcepcion?: string;

  @IsString()
  @IsOptional()
  fundamentoConstitucionalLegal?: string;

  @IsString()
  @IsOptional()
  fundamentoJuridicoExcepcion?: string;

  @IsString()
  @IsOptional()
  excepcionTotalParcial?: string;

  @IsDateString()
  @IsOptional()
  fechaClasificacion?: string;

  @IsString()
  @IsOptional()
  tiempoClasificacion?: string;

  // Datos personales
  @IsBoolean()
  @IsOptional()
  contieneDatosPersonales?: boolean;

  @IsBoolean()
  @IsOptional()
  contieneDatosMenores?: boolean;

  @IsString()
  @IsOptional()
  tiposDatosPersonales?: string;

  @IsString()
  @IsOptional()
  finalidadTratamiento?: string;

  @IsBoolean()
  @IsOptional()
  existeAutorizacionTratamiento?: boolean;
}
