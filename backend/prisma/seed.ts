import { PrismaClient, Rol, TipoControl, EstadoRiesgo, EstadoPlan } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.auditoria.deleteMany();
  await prisma.evidencia.deleteMany();
  await prisma.planAccion.deleteMany();
  await prisma.control.deleteMany();
  await prisma.evaluacionRiesgo.deleteMany();
  await prisma.riesgo.deleteMany();
  await prisma.activo.deleteMany();
  await prisma.subproceso.deleteMany();
  await prisma.proceso.deleteMany();
  await prisma.macroproceso.deleteMany();
  await prisma.dependencia.deleteMany();
  await prisma.usuario.deleteMany();

  const passwordHash = await bcrypt.hash('Admin123!', 10);

  // ============ DEPENDENCIAS ============
  const depData = [
    { nombre: 'Secretaría de Planeación', codigo: 'SP' },
    { nombre: 'Oficina de Cooperación Internacional', codigo: 'OCI' },
    { nombre: 'Secretaría de Hacienda', codigo: 'SH' },
    { nombre: 'Oficina de Comunicaciones', codigo: 'OC' },
    { nombre: 'Oficina TIC', codigo: 'TIC' },
    { nombre: 'Secretaría de Salud', codigo: 'SS' },
    { nombre: 'Secretaría de Educación', codigo: 'SE' },
    { nombre: 'Secretaría de Gobierno', codigo: 'SG' },
    { nombre: 'Secretaría de Tránsito', codigo: 'STR' },
    { nombre: 'Secretaría de Vivienda', codigo: 'SV' },
    { nombre: 'Secretaría de Cultura', codigo: 'SC' },
    { nombre: 'Secretaría de Turismo', codigo: 'STU' },
    { nombre: 'Secretaría de Asuntos Étnicos', codigo: 'SAE' },
    { nombre: 'Secretaría de Infraestructura Física', codigo: 'SIF' },
    { nombre: 'Secretaría de Ambiente', codigo: 'SA' },
    { nombre: 'Secretaría de Desarrollo Social', codigo: 'SDS' },
    { nombre: 'Secretaría de Agricultura', codigo: 'SAG' },
    { nombre: 'Unidad de Posconflicto', codigo: 'UP' },
    { nombre: 'Tesorero(a)', codigo: 'TES' },
    { nombre: 'Secretaría General', codigo: 'SGE' },
    { nombre: 'Oficina Jurídica', codigo: 'SJ' },
    { nombre: 'Oficina de Control Interno', codigo: 'OCI2' },
    { nombre: 'Talento Humano', codigo: 'TH' },
    { nombre: 'Archivo Central', codigo: 'AC' },
    { nombre: 'Oficina de Control Interno Disciplinario', codigo: 'OCID' },
    { nombre: 'Secretaría de Gestión Institucional', codigo: 'SGI' },
  ];

  const dependencias = await Promise.all(
    depData.map(d => prisma.dependencia.create({ data: d }))
  );

  const depMap = Object.fromEntries(
    dependencias.map(d => [d.nombre, d])
  );

  // ============ USUARIOS ============
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: { email: 'admin@entidad.gov.co', passwordHash, nombre: 'Carlos Andrés', cargo: 'Administrador del Sistema', rol: Rol.ADMINISTRADOR, dependenciaId: depMap['Oficina TIC'].id },
    }),
    prisma.usuario.create({
      data: { email: 'planeacion@entidad.gov.co', passwordHash, nombre: 'María Fernanda', cargo: 'Secretaria de Planeación', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Secretaría de Planeación'].id },
    }),
    prisma.usuario.create({
      data: { email: 'hacienda@entidad.gov.co', passwordHash, nombre: 'Juan Pablo', cargo: 'Secretario de Hacienda', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Secretaría de Hacienda'].id },
    }),
    prisma.usuario.create({
      data: { email: 'tecnologia@entidad.gov.co', passwordHash, nombre: 'Laura Camila', cargo: 'Director TIC', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Oficina TIC'].id },
    }),
    prisma.usuario.create({
      data: { email: 'juridica@entidad.gov.co', passwordHash, nombre: 'Andrés Felipe', cargo: 'Secretario Jurídico', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Oficina Jurídica'].id },
    }),
    prisma.usuario.create({
      data: { email: 'control@entidad.gov.co', passwordHash, nombre: 'Diana Patricia', cargo: 'Jefe de Control Interno', rol: Rol.AUDITOR, dependenciaId: depMap['Oficina de Control Interno'].id },
    }),
    prisma.usuario.create({
      data: { email: 'talento@entidad.gov.co', passwordHash, nombre: 'Roberto Carlos', cargo: 'Director de Talento Humano', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Talento Humano'].id },
    }),
    prisma.usuario.create({
      data: { email: 'archivo@entidad.gov.co', passwordHash, nombre: 'Gloria Inés', cargo: 'Jefe de Archivo', rol: Rol.CONSULTA, dependenciaId: depMap['Archivo Central'].id },
    }),
    prisma.usuario.create({
      data: { email: 'consulta@entidad.gov.co', passwordHash, nombre: 'Pedro Luis', cargo: 'Analista', rol: Rol.CONSULTA, dependenciaId: depMap['Secretaría de Planeación'].id },
    }),
    prisma.usuario.create({
      data: { email: 'salud@entidad.gov.co', passwordHash, nombre: 'Ana María', cargo: 'Secretaria de Salud', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Secretaría de Salud'].id },
    }),
    prisma.usuario.create({
      data: { email: 'educacion@entidad.gov.co', passwordHash, nombre: 'Luis Fernando', cargo: 'Secretario de Educación', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Secretaría de Educación'].id },
    }),
    prisma.usuario.create({
      data: { email: 'gobierno@entidad.gov.co', passwordHash, nombre: 'Carmen Elena', cargo: 'Secretaria de Gobierno', rol: Rol.LIDER_PROCESO, dependenciaId: depMap['Secretaría de Gobierno'].id },
    }),
  ]);

  const [
    usuarioAdmin, usuarioPlaneacion, usuarioHacienda,
    usuarioTecnologia, usuarioJuridica, usuarioControl,
    usuarioTalento, usuarioArchivo, usuarioConsulta,
    usuarioSalud, usuarioEducacion, usuarioGobierno,
  ] = usuarios;

  // ============ MACROPROCESOS ============
  const macroData = [
    { grupo: 'Direccionamiento Estratégico', dependencia: 'Secretaría de Planeación' },
    { grupo: 'Direccionamiento Estratégico', dependencia: 'Oficina de Cooperación Internacional' },
    { grupo: 'Direccionamiento Estratégico', dependencia: 'Secretaría de Hacienda' },
    { grupo: 'Gestión de la Información y las Comunicaciones', dependencia: 'Oficina de Comunicaciones' },
    { grupo: 'Gestión de la Información y las Comunicaciones', dependencia: 'Oficina TIC' },
    { grupo: 'Gestión de Servicios de Salud', dependencia: 'Secretaría de Salud' },
    { grupo: 'Gestión Educativa', dependencia: 'Secretaría de Educación' },
    { grupo: 'Convivencia Ciudadana, Seguridad y Orden Público', dependencia: 'Secretaría de Gobierno' },
    { grupo: 'Convivencia Ciudadana, Seguridad y Orden Público', dependencia: 'Secretaría de Tránsito' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Vivienda' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Cultura' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Turismo' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Asuntos Étnicos' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Infraestructura Física' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Ambiente' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Desarrollo Social' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Secretaría de Agricultura' },
    { grupo: 'Desarrollo Social Integral y Ambiental del Territorio', dependencia: 'Unidad de Posconflicto' },
    { grupo: 'Gestión Financiera', dependencia: 'Tesorero(a)' },
    { grupo: 'Gestión Financiera', dependencia: 'Secretaría de Hacienda' },
    { grupo: 'Gestión Catastral', dependencia: 'Secretaría de Hacienda' },
    { grupo: 'Gestión Administrativa', dependencia: 'Secretaría General' },
    { grupo: 'Gestión Administrativa', dependencia: 'Secretaría de Gestión Institucional' },
    { grupo: 'Gestión del Talento Humano', dependencia: 'Secretaría de Gestión Institucional' },
    { grupo: 'Gestión del Talento Humano', dependencia: 'Oficina de Control Interno Disciplinario' },
    { grupo: 'Gestión Jurídica', dependencia: 'Oficina Jurídica' },
    { grupo: 'Gestión Estadística', dependencia: 'Secretaría de Planeación' },
    { grupo: 'Control Interno', dependencia: 'Oficina de Control Interno' },
  ];

  const macroprocesos = await Promise.all(
    macroData.map(m =>
      prisma.macroproceso.create({
        data: { nombre: m.grupo, dependenciaId: depMap[m.dependencia].id },
      })
    )
  );

  const macroMap: Record<string, string> = {};
  for (let i = 0; i < macroData.length; i++) {
    const key = `${macroData[i].dependencia}|${macroData[i].grupo}`;
    macroMap[key] = macroprocesos[i].id;
  }

  // ============ PROCESOS ============
  const procesosData = [
    { nivel: 'ESTRATEGICO', nombre: 'Banco de Programas y Proyectos', macro: 'Direccionamiento Estratégico', dep: 'Secretaría de Planeación' },
    { nivel: 'ESTRATEGICO', nombre: 'Gestión para el Mejoramiento Institucional', macro: 'Direccionamiento Estratégico', dep: 'Secretaría de Planeación' },
    { nivel: 'ESTRATEGICO', nombre: 'Ordenamiento Territorial', macro: 'Direccionamiento Estratégico', dep: 'Secretaría de Planeación' },
    { nivel: 'ESTRATEGICO', nombre: 'Cooperación Internacional', macro: 'Direccionamiento Estratégico', dep: 'Oficina de Cooperación Internacional' },
    { nivel: 'ESTRATEGICO', nombre: 'Gestión Presupuestal', macro: 'Direccionamiento Estratégico', dep: 'Secretaría de Hacienda' },
    { nivel: 'ESTRATEGICO', nombre: 'Comunicación Pública', macro: 'Gestión de la Información y las Comunicaciones', dep: 'Oficina de Comunicaciones' },
    { nivel: 'ESTRATEGICO', nombre: 'Tecnologías de la Información', macro: 'Gestión de la Información y las Comunicaciones', dep: 'Oficina TIC' },
    { nivel: 'MISIONAL', nombre: 'Aseguramiento en Salud', macro: 'Gestión de Servicios de Salud', dep: 'Secretaría de Salud' },
    { nivel: 'MISIONAL', nombre: 'Salud Pública', macro: 'Gestión de Servicios de Salud', dep: 'Secretaría de Salud' },
    { nivel: 'MISIONAL', nombre: 'Salud Ambiental', macro: 'Gestión de Servicios de Salud', dep: 'Secretaría de Salud' },
    { nivel: 'MISIONAL', nombre: 'Defensa de los Derechos de los Ciudadanos', macro: 'Gestión de Servicios de Salud', dep: 'Secretaría de Salud' },
    { nivel: 'MISIONAL', nombre: 'Calidad Educativa', macro: 'Gestión Educativa', dep: 'Secretaría de Educación' },
    { nivel: 'MISIONAL', nombre: 'Cobertura Educativa', macro: 'Gestión Educativa', dep: 'Secretaría de Educación' },
    { nivel: 'MISIONAL', nombre: 'Inspección y Vigilancia Educativa', macro: 'Gestión Educativa', dep: 'Secretaría de Educación' },
    { nivel: 'MISIONAL', nombre: 'Convivencia y Cultura Ciudadana', macro: 'Convivencia Ciudadana, Seguridad y Orden Público', dep: 'Secretaría de Gobierno' },
    { nivel: 'MISIONAL', nombre: 'Gestión de Riesgo de Desastres', macro: 'Convivencia Ciudadana, Seguridad y Orden Público', dep: 'Secretaría de Gobierno' },
    { nivel: 'MISIONAL', nombre: 'Víctimas', macro: 'Convivencia Ciudadana, Seguridad y Orden Público', dep: 'Secretaría de Gobierno' },
    { nivel: 'MISIONAL', nombre: 'Gestión de Movilidad y Seguridad Vial', macro: 'Convivencia Ciudadana, Seguridad y Orden Público', dep: 'Secretaría de Tránsito' },
    { nivel: 'MISIONAL', nombre: 'Gestión de Vivienda y Saneamiento Básico', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Vivienda' },
    { nivel: 'MISIONAL', nombre: 'Gestión Cultural', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Cultura' },
    { nivel: 'MISIONAL', nombre: 'Gestión Turística', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Turismo' },
    { nivel: 'MISIONAL', nombre: 'Gestión para las Comunidades Étnicas', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Asuntos Étnicos' },
    { nivel: 'MISIONAL', nombre: 'Mantenimiento Espacios de Uso Público e Infraestructura Vial', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Infraestructura Física' },
    { nivel: 'MISIONAL', nombre: 'Sostenibilidad Ambiental y Minera', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Ambiente' },
    { nivel: 'MISIONAL', nombre: 'Atención Social y Participación Ciudadana', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Desarrollo Social' },
    { nivel: 'MISIONAL', nombre: 'Desarrollo Agropecuario', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Secretaría de Agricultura' },
    { nivel: 'MISIONAL', nombre: 'Gestión para el Posconflicto', macro: 'Desarrollo Social Integral y Ambiental del Territorio', dep: 'Unidad de Posconflicto' },
    { nivel: 'APOYO', nombre: 'Tesoría', macro: 'Gestión Financiera', dep: 'Tesorero(a)' },
    { nivel: 'APOYO', nombre: 'Fiscalización', macro: 'Gestión Financiera', dep: 'Secretaría de Hacienda' },
    { nivel: 'APOYO', nombre: 'Contabilidad General', macro: 'Gestión Financiera', dep: 'Secretaría de Hacienda' },
    { nivel: 'APOYO', nombre: 'Actualización catastral', macro: 'Gestión Catastral', dep: 'Secretaría de Hacienda' },
    { nivel: 'APOYO', nombre: 'Conservación catastral', macro: 'Gestión Catastral', dep: 'Secretaría de Hacienda' },
    { nivel: 'APOYO', nombre: 'Atención al Ciudadano', macro: 'Gestión Administrativa', dep: 'Secretaría General' },
    { nivel: 'APOYO', nombre: 'Gestión Documental', macro: 'Gestión Administrativa', dep: 'Secretaría General' },
    { nivel: 'APOYO', nombre: 'Administración Galería', macro: 'Gestión Administrativa', dep: 'Secretaría General' },
    { nivel: 'APOYO', nombre: 'Gestión de Inventarios de Bienes Muebles e Inmuebles', macro: 'Gestión Administrativa', dep: 'Secretaría de Gestión Institucional' },
    { nivel: 'APOYO', nombre: 'Administración del Talento Humano', macro: 'Gestión del Talento Humano', dep: 'Secretaría de Gestión Institucional' },
    { nivel: 'APOYO', nombre: 'Seguridad y Salud en el Trabajo', macro: 'Gestión del Talento Humano', dep: 'Secretaría de Gestión Institucional' },
    { nivel: 'APOYO', nombre: 'Control disciplinario', macro: 'Gestión del Talento Humano', dep: 'Oficina de Control Interno Disciplinario' },
    { nivel: 'APOYO', nombre: 'Gestión contractual', macro: 'Gestión Jurídica', dep: 'Oficina Jurídica' },
    { nivel: 'APOYO', nombre: 'Defensa judicial', macro: 'Gestión Jurídica', dep: 'Oficina Jurídica' },
    { nivel: 'APOYO', nombre: 'Juzgamiento disciplinario', macro: 'Gestión Jurídica', dep: 'Oficina Jurídica' },
    { nivel: 'APOYO', nombre: 'Gestión del Sisbén', macro: 'Gestión Estadística', dep: 'Secretaría de Planeación' },
    { nivel: 'APOYO', nombre: 'Información Estadística', macro: 'Gestión Estadística', dep: 'Secretaría de Planeación' },
    { nivel: 'EVALUACION', nombre: 'Evaluación a la Gestión', macro: 'Control Interno', dep: 'Oficina de Control Interno' },
  ];

  const procesos = await Promise.all(
    procesosData.map((p, i) =>
      prisma.proceso.create({
        data: {
          nombre: p.nombre,
          nivel: p.nivel,
          codigo: `${p.macro.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
          macroprocesoId: macroMap[`${p.dep}|${p.macro}`],
        },
      })
    )
  );

  const procMap = Object.fromEntries(
    procesosData.map((p, i) => [p.nombre, procesos[i]])
  );

  const procToMacro = Object.fromEntries(
    procesos.map(p => [p.id, p.macroprocesoId])
  );

  // ============ SUBPROCESOS ============
  const subprocesosData = [
    { proceso: 'Banco de Programas y Proyectos', nombre: 'Formulación de proyectos', codigo: 'BPP-001' },
    { proceso: 'Banco de Programas y Proyectos', nombre: 'Evaluación de viabilidad', codigo: 'BPP-002' },
    { proceso: 'Banco de Programas y Proyectos', nombre: 'Seguimiento de proyectos', codigo: 'BPP-003' },
    { proceso: 'Tecnologías de la Información', nombre: 'Mesa de servicio TI', codigo: 'TIC-001' },
    { proceso: 'Tecnologías de la Información', nombre: 'Administración de infraestructura', codigo: 'TIC-002' },
    { proceso: 'Tecnologías de la Información', nombre: 'Seguridad de la información', codigo: 'TIC-003' },
    { proceso: 'Tecnologías de la Información', nombre: 'Desarrollo y mantenimiento de software', codigo: 'TIC-004' },
    { proceso: 'Atención al Ciudadano', nombre: 'PQRSDF', codigo: 'AC-001' },
    { proceso: 'Atención al Ciudadano', nombre: 'Orientación al usuario', codigo: 'AC-002' },
    { proceso: 'Gestión Documental', nombre: 'Ventanilla única', codigo: 'GD-001' },
    { proceso: 'Gestión Documental', nombre: 'Archivo central', codigo: 'GD-002' },
    { proceso: 'Gestión Documental', nombre: 'Organización documental', codigo: 'GD-003' },
    { proceso: 'Administración del Talento Humano', nombre: 'Nómina', codigo: 'TH-001' },
    { proceso: 'Administración del Talento Humano', nombre: 'Prestaciones sociales', codigo: 'TH-002' },
    { proceso: 'Administración del Talento Humano', nombre: 'Evaluación de desempeño', codigo: 'TH-003' },
    { proceso: 'Seguridad y Salud en el Trabajo', nombre: 'Medicina preventiva', codigo: 'SST-001' },
    { proceso: 'Seguridad y Salud en el Trabajo', nombre: 'Higiene y seguridad industrial', codigo: 'SST-002' },
    { proceso: 'Gestión contractual', nombre: 'Elaboración de contratos', codigo: 'GC-001' },
    { proceso: 'Gestión contractual', nombre: 'Supervisión contractual', codigo: 'GC-002' },
    { proceso: 'Evaluación a la Gestión', nombre: 'Auditorías internas', codigo: 'EG-001' },
    { proceso: 'Evaluación a la Gestión', nombre: 'Planes de mejoramiento', codigo: 'EG-002' },
    { proceso: 'Evaluación a la Gestión', nombre: 'Indicadores de gestión', codigo: 'EG-003' },
  ];

  await Promise.all(
    subprocesosData.map(sp =>
      prisma.subproceso.create({
        data: { nombre: sp.nombre, procesoId: procMap[sp.proceso].id },
      })
    )
  );

  const ticProcesoId = procMap['Tecnologías de la Información'].id;

  function ciaLabel(v: number | null | undefined): string | undefined {
    if (v == null) return undefined;
    if (v <= 2) return 'Baja';
    if (v <= 3) return 'Media';
    return 'Alta';
  }

  function calcCriticidad(c: number | null | undefined, i: number | null | undefined, d: number | null | undefined): string {
    const values = [c, i, d].filter((v): v is number => v != null);
    if (values.length === 0) return 'Sin clasificar';
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    if (avg >= 4) return 'Alta';
    if (avg >= 2.5) return 'Media';
    return 'Baja';
  }

  interface ActivoInput {
    nombre: string;
    identificador?: string | null;
    tipo: string;
    subTipo?: string | null;
    valorC?: number | null;
    valorI?: number | null;
    valorD?: number | null;
    descripcion?: string | null;
    lugarConsulta?: string | null;
    soporteRegistro?: string | null;
    formato?: string | null;
    idioma?: string | null;
    contieneDatosPersonales?: boolean | null;
    contieneDatosMenores?: boolean | null;
    propietarioCargo?: string;
    custodioCargo?: string;
    responsableUserId?: string;
    dependenciaDept?: string;
    procesoId?: string;
  }

  const activosData: ActivoInput[] = [
    // ===== Documentos, políticas y planes TIC (Items 1-14) =====
    { nombre: 'Acta verificación 2015', identificador: 'ACT-2015-01', tipo: 'Documento', subTipo: 'Plataformas Misionles', valorC: 3, valorI: 3, valorD: 3, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Físico/Electrónico', formato: 'Archivos Institucionales - físicos', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Correo Electronico', identificador: 'TIC-CE-001', tipo: 'Documento', valorC: 5, valorI: 1, lugarConsulta: 'correo electrónico', soporteRegistro: 'Elctrónico', formato: 'Archivos Institucionales - físicos', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Documentación Proyectos TI', identificador: 'TIC-PTI-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Documentación Gestion de Cambios Tecnologicos', identificador: 'TIC-DGC-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Politica de seguridad y privacidad de la informacion.', identificador: 'TIC-PSPI-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Politica de seguridad informacion del sitio Web.', identificador: 'TIC-PSISW-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: false, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Plan Estratégico de Tecnologías de la Información', identificador: 'TIC-PETIC-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: false, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Plan de Tratamiento de Riesgos de seguridad de la Informacion', identificador: 'TIC-PTSI-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: false, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'CONTROL DOC secretaria', identificador: null, tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Servicio de Nube', identificador: 'TIC-SN-001', tipo: 'Infraestructura', valorC: 5, valorI: 5, valorD: 1, soporteRegistro: 'Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Directorio Activo (Active Directory)', identificador: 'TIC-DA-001', tipo: 'Infraestructura', valorC: 1, valorI: 3, valorD: 1, soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: false, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Catalogo de Sistemas de Información de Entidad', identificador: 'TIC-CSI-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: false, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Catalogo de Servicios Tecnologicos', identificador: 'TIC-CST-001', tipo: 'Documento', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Físico/Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: false, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Herramienta de Mesa de Servicio', identificador: 'TIC-HMS-001', tipo: 'Software', valorC: 1, valorI: 1, valorD: 1, lugarConsulta: 'https://www.jamundi.gov.co/Transparencia/', soporteRegistro: 'Software', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },

    // ===== Servidores y VMs - Centro Comercial Caña Dulce (Items 15-36, 43-66) =====
    { nombre: 'server dellr660 (PowerEdge R660xs)', identificador: 'SR-01', tipo: 'Hardware', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'ZKBio-Security', identificador: 'VM01', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Zabbix-7.2', identificador: 'VM02', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Radius-hotspot', identificador: 'VM03', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'ServerDB', identificador: 'LXC01', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Hosting-sitios-Web', identificador: 'LXC02', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'GestionPD-v1.0', identificador: 'LXC03', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'palacio-container-2', identificador: 'LXC04', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Radius', identificador: 'LXC05', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Visor-Catastral', identificador: 'LXC06', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'server04-(computer-desktop)', identificador: 'SR-O2', tipo: 'Hardware', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Issabel-PBX-5', identificador: 'VM-04', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'FinanzasSQL2008', identificador: 'VM-05', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'FinanzasSQL2012', identificador: 'VM-06', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'The-dude', identificador: 'VM-07', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Server-transito-4', identificador: 'LXC-07', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'UbuntuServerTransito', identificador: 'VM-08', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Server-transito-2', identificador: 'LXC-08', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Server-transito-3', identificador: 'LXC-09', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Unifi', identificador: 'LXC-10', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Intranet', identificador: 'LXC-11', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'SMB-server', identificador: 'LXC-12', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },

    // ===== Servidores - Palacio Municipal (Items 37-42) =====
    { nombre: 'server3 (PowerEdge R320)', identificador: 'SR-02', tipo: 'Hardware', valorC: 5, valorI: 5, lugarConsulta: 'Palacio Municipal', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Windows10', identificador: 'VM-08', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Palacio Municipal', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'UbuntuServer20.04', identificador: 'LXC-13', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Palacio Municipal', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'TalentoHumano', identificador: 'LXC-14', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Palacio Municipal', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Solutraffic', identificador: 'LXC-15', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Palacio Municipal', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'nginx', identificador: 'LXC-16', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Palacio Municipal', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },

    // ===== VMs y Bases de Datos - Centro Comercial Caña Dulce (Items 43-66) =====
    { nombre: 'virtualserver', identificador: 'VM-09', tipo: 'Infraestructura', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'OCSinventory', identificador: 'VM-10', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Zentyal7', identificador: 'VM-11', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'RENTAS', identificador: 'VM-12', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Aire-PLUS-Centos', identificador: 'VM-13', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'UBUNTU-Hacienda', identificador: 'LXC-17', tipo: 'Software', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Físico', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltaalmacen2012', identificador: 'BD-01', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltanomina', identificador: 'BD-02', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2007', identificador: 'BD-03', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2008', identificador: 'BD-04', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2009', identificador: 'BD-05', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2010', identificador: 'BD-06', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2011', identificador: 'BD-07', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2012', identificador: 'BD-08', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2013', identificador: 'BD-09', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2014', identificador: 'BD-10', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2015', identificador: 'BD-11', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2016', identificador: 'BD-12', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2017', identificador: 'BD-13', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2018', identificador: 'BD-14', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltafin2019', identificador: 'BD-15', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Deltfain2020', identificador: 'BD-16', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'DeltaResguardo', identificador: 'BD-17', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },
    { nombre: 'Impuestos', identificador: 'BD-18', tipo: 'Información', valorC: 5, valorI: 5, lugarConsulta: 'Centro Comercial Caña Dulce', soporteRegistro: 'Digital / Electrónico', formato: 'Digital', idioma: 'Español', contieneDatosPersonales: true, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC', procesoId: ticProcesoId },

    // ===== Activos genéricos de soporte (no TIC) =====
    { nombre: 'Expedientes Físicos', tipo: 'Información', valorC: 4, valorI: 5, valorD: 3, descripcion: 'Expedientes contractuales y documentales', lugarConsulta: 'Archivo Central', soporteRegistro: 'Físico', contieneDatosPersonales: true, propietarioCargo: 'Jefe de Archivo', custodioCargo: 'Auxiliar de Archivo', responsableUserId: usuarioArchivo.id, dependenciaDept: 'Archivo Central' },
    { nombre: 'Red de Datos', tipo: 'Infraestructura', valorC: 4, valorI: 4, valorD: 5, descripcion: 'Red LAN y WAN institucional', lugarConsulta: 'Toda la entidad', contieneDatosPersonales: false, propietarioCargo: 'Jefe TIC', custodioCargo: 'Jefe TIC' },
    { nombre: 'Sistema Financiero', tipo: 'Software', valorC: 5, valorI: 5, valorD: 5, descripcion: 'Sistema de gestión financiera SIIF', lugarConsulta: 'Data Center', contieneDatosPersonales: true, propietarioCargo: 'Secretario de Hacienda', custodioCargo: 'Jefe de Presupuesto', responsableUserId: usuarioHacienda.id, dependenciaDept: 'Secretaría de Hacienda' },
    { nombre: 'Historia Clínica Digital', tipo: 'Información', valorC: 5, valorI: 5, valorD: 5, descripcion: 'Base de datos de historias clínicas', lugarConsulta: 'Servidor Salud', contieneDatosPersonales: true, contieneDatosMenores: true, propietarioCargo: 'Secretario de Salud', custodioCargo: 'Jefe de Archivo Clínico', responsableUserId: usuarioSalud.id, dependenciaDept: 'Secretaría de Salud' },
    { nombre: 'Plataforma Educativa', tipo: 'Software', valorC: 3, valorI: 4, valorD: 4, descripcion: 'Sistema de gestión educativa', lugarConsulta: 'Cloud', contieneDatosPersonales: true, propietarioCargo: 'Secretario de Educación', custodioCargo: 'Jefe de Sistemas Educativos', responsableUserId: usuarioEducacion.id, dependenciaDept: 'Secretaría de Educación' },
  ];

  const activos = await Promise.all(
    activosData.map(a => {
      const confidencialidad = ciaLabel(a.valorC);
      const integridad = ciaLabel(a.valorI);
      const disponibilidad = ciaLabel(a.valorD);
      const criticidad = calcCriticidad(a.valorC, a.valorI, a.valorD);
      return prisma.activo.create({
        data: {
          nombre: a.nombre,
          identificador: a.identificador ?? undefined,
          tipo: a.tipo,
          subTipo: a.subTipo ?? undefined,
          valorC: a.valorC ?? undefined,
          valorI: a.valorI ?? undefined,
          valorD: a.valorD ?? undefined,
          confidencialidad,
          integridad,
          disponibilidad,
          criticidad,
          descripcion: a.descripcion ?? undefined,
          lugarConsulta: a.lugarConsulta ?? undefined,
          soporteRegistro: a.soporteRegistro ?? undefined,
          formato: a.formato ?? undefined,
          idioma: a.idioma ?? undefined,
          contieneDatosPersonales: a.contieneDatosPersonales ?? undefined,
          propietarioCargo: a.propietarioCargo ?? undefined,
          custodioCargo: a.custodioCargo ?? undefined,
          responsableId: a.responsableUserId ?? usuarioTecnologia.id,
          dependenciaId: a.dependenciaDept ? depMap[a.dependenciaDept].id : depMap['Oficina TIC'].id,
          procesoId: a.procesoId ?? undefined,
          macroprocesoId: a.procesoId ? (procToMacro[a.procesoId] ?? undefined) : undefined,
        },
      });
    })
  );

  const activoMap = Object.fromEntries(
    activos.map(a => [a.nombre, a])
  );

  // ============ RIESGOS (referencian activos por nombre) ============
  const riesgos = await Promise.all([
    prisma.riesgo.create({
      data: {
        nombre: 'Pérdida de información contractual',
        descripcion: 'Riesgo de pérdida o deterioro de expedientes contractuales',
        causa: 'Almacenamiento inadecuado y falta de digitalización',
        consecuencia: 'Imposibilidad de responder requerimientos legales y pérdida de memoria institucional',
        clasificacion: 'Operativo',
        tipoRiesgo: 'Interno',
        estado: EstadoRiesgo.EVALUADO,
        procesoId: procMap['Banco de Programas y Proyectos'].id,
        activoId: activoMap['Expedientes Físicos'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Caída del servidor de correo electrónico',
        descripcion: 'Interrupción del servicio de correo institucional',
        causa: 'Falta de mantenimiento y actualización del servidor',
        consecuencia: 'Parálisis en la comunicación institucional',
        clasificacion: 'Tecnológico',
        tipoRiesgo: 'Interno',
        estado: EstadoRiesgo.EVALUADO,
        procesoId: procMap['Tecnologías de la Información'].id,
        activoId: activoMap['Correo Electronico'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Acceso no autorizado a datos sensibles',
        descripcion: 'Filtración de información confidencial',
        causa: 'Debilidades en controles de acceso y autenticación',
        consecuencia: 'Sanciones legales, pérdida de confianza y multas por incumplimiento de protección de datos',
        clasificacion: 'Seguridad de la Información',
        tipoRiesgo: 'Externo',
        estado: EstadoRiesgo.EVALUADO,
        procesoId: procMap['Tecnologías de la Información'].id,
        activoId: activoMap['Directorio Activo (Active Directory)'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Pérdida de conectividad',
        descripcion: 'Interrupción de la red de datos institucional',
        causa: 'Daño en equipos de red o cortes de energía',
        consecuencia: 'Detención de operaciones y servicios en línea',
        clasificacion: 'Tecnológico',
        tipoRiesgo: 'Externo',
        estado: EstadoRiesgo.EVALUADO,
        procesoId: procMap['Tecnologías de la Información'].id,
        activoId: activoMap['Red de Datos'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Desviación presupuestal',
        descripcion: 'Ejecución inadecuada del presupuesto',
        causa: 'Falta de controles en la ejecución y seguimiento',
        consecuencia: 'Sanciones fiscales y disciplinarias, pérdida de recursos',
        clasificacion: 'Financiero',
        tipoRiesgo: 'Interno',
        estado: EstadoRiesgo.EVALUADO,
        procesoId: procMap['Gestión Presupuestal'].id,
        activoId: activoMap['Sistema Financiero'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Incumplimiento normativo en contratación',
        descripcion: 'Errores en procesos de contratación',
        causa: 'Desconocimiento de la normativa y cambios regulatorios',
        consecuencia: 'Multas, sanciones y nulidad de contratos',
        clasificacion: 'Cumplimiento',
        tipoRiesgo: 'Externo',
        estado: EstadoRiesgo.IDENTIFICADO,
        procesoId: procMap['Banco de Programas y Proyectos'].id,
        activoId: activoMap['Expedientes Físicos'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Caída del servidor principal',
        descripcion: 'Falla crítica en servidor PowerEdge',
        causa: 'Vida útil del hardware superada, falta de mantenimiento',
        consecuencia: 'Detención total de servicios TI institucionales',
        clasificacion: 'Tecnológico',
        tipoRiesgo: 'Interno',
        estado: EstadoRiesgo.EN_TRATAMIENTO,
        procesoId: procMap['Tecnologías de la Información'].id,
        activoId: activoMap['server dellr660 (PowerEdge R660xs)'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Interrupción de servicios de salud',
        descripcion: 'Suspensión en la prestación de servicios de salud',
        causa: 'Fallas en el sistema de aseguramiento',
        consecuencia: 'Aumento de morbilidad y quejas de la comunidad',
        clasificacion: 'Operativo',
        tipoRiesgo: 'Interno',
        estado: EstadoRiesgo.IDENTIFICADO,
        procesoId: procMap['Aseguramiento en Salud'].id,
        activoId: activoMap['Historia Clínica Digital'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Deserción escolar',
        descripcion: 'Aumento de la tasa de deserción educativa',
        causa: 'Falta de programas de retención y acompañamiento',
        consecuencia: 'Incumplimiento de metas de cobertura y calidad educativa',
        clasificacion: 'Operativo',
        tipoRiesgo: 'Interno',
        estado: EstadoRiesgo.IDENTIFICADO,
        procesoId: procMap['Cobertura Educativa'].id,
        activoId: activoMap['Plataforma Educativa'].id,
      },
    }),
    prisma.riesgo.create({
      data: {
        nombre: 'Siniestro vial no reportado',
        descripcion: 'Falta de reporte oportuno de accidentes de tránsito',
        causa: 'Deficiencia en los sistemas de monitoreo y reporte',
        consecuencia: 'Subregistro de siniestralidad y mala planeación de seguridad vial',
        clasificacion: 'Operativo',
        tipoRiesgo: 'Interno',
        estado: EstadoRiesgo.IDENTIFICADO,
        procesoId: procMap['Gestión de Movilidad y Seguridad Vial'].id,
        activoId: activoMap['Server-transito-2'].id,
      },
    }),
  ]);

  // ============ EVALUACIONES ============
  const evaluaciones = await Promise.all([
    prisma.evaluacionRiesgo.create({
      data: {
        riesgoId: riesgos[0].id,
        probabilidad: 4,
        impacto: 5,
        riesgoInherente: 20,
        evaluadoPorId: usuarioJuridica.id,
        observaciones: 'El expediente físico está en bodega sin condiciones ambientales controladas',
      },
    }),
    prisma.evaluacionRiesgo.create({
      data: {
        riesgoId: riesgos[1].id,
        probabilidad: 3,
        impacto: 4,
        riesgoInherente: 12,
        evaluadoPorId: usuarioTecnologia.id,
        observaciones: 'El servidor tiene más de 5 años sin actualización mayor',
      },
    }),
    prisma.evaluacionRiesgo.create({
      data: {
        riesgoId: riesgos[2].id,
        probabilidad: 2,
        impacto: 5,
        riesgoInherente: 10,
        evaluadoPorId: usuarioTecnologia.id,
        observaciones: 'Se requiere implementar autenticación multifactor',
      },
    }),
    prisma.evaluacionRiesgo.create({
      data: {
        riesgoId: riesgos[3].id,
        probabilidad: 3,
        impacto: 4,
        riesgoInherente: 12,
        evaluadoPorId: usuarioTecnologia.id,
        observaciones: 'No hay redundancia en el enlace principal',
      },
    }),
    prisma.evaluacionRiesgo.create({
      data: {
        riesgoId: riesgos[4].id,
        probabilidad: 3,
        impacto: 5,
        riesgoInherente: 15,
        evaluadoPorId: usuarioHacienda.id,
        observaciones: 'Los informes de ejecución se generan manualmente',
      },
    }),
    prisma.evaluacionRiesgo.create({
      data: {
        riesgoId: riesgos[7].id,
        probabilidad: 4,
        impacto: 5,
        riesgoInherente: 20,
        evaluadoPorId: usuarioSalud.id,
        observaciones: 'Se requiere auditoría externa del sistema de aseguramiento',
      },
    }),
    prisma.evaluacionRiesgo.create({
      data: {
        riesgoId: riesgos[8].id,
        probabilidad: 3,
        impacto: 4,
        riesgoInherente: 12,
        evaluadoPorId: usuarioEducacion.id,
        observaciones: 'Faltan indicadores de alerta temprana de deserción',
      },
    }),
  ]);

  // ============ CONTROLES ============
  await Promise.all([
    prisma.control.create({
      data: {
        nombre: 'Digitalización de expedientes',
        descripcion: 'Proceso de digitalización gradual de expedientes contractuales',
        tipoControl: TipoControl.CORRECTIVO,
        frecuencia: 'Mensual',
        eficacia: 40,
        responsableId: usuarioArchivo.id,
        evaluacionId: evaluaciones[0].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Respaldo en la nube',
        descripcion: 'Copia de seguridad en cloud de documentos digitalizados',
        tipoControl: TipoControl.PREVENTIVO,
        frecuencia: 'Semanal',
        eficacia: 60,
        responsableId: usuarioTecnologia.id,
        evaluacionId: evaluaciones[0].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Mantenedor de servidores',
        descripcion: 'Plan de mantenimiento preventivo trimestral',
        tipoControl: TipoControl.PREVENTIVO,
        frecuencia: 'Trimestral',
        eficacia: 30,
        responsableId: usuarioTecnologia.id,
        evaluacionId: evaluaciones[1].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Autenticación multifactor',
        descripcion: 'Implementación de MFA para sistemas críticos',
        tipoControl: TipoControl.PREVENTIVO,
        frecuencia: 'Diario',
        eficacia: 80,
        responsableId: usuarioTecnologia.id,
        evaluacionId: evaluaciones[2].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Firewall perimetral',
        descripcion: 'Firewall de última generación con IDS/IPS',
        tipoControl: TipoControl.PREVENTIVO,
        frecuencia: 'Tiempo real',
        eficacia: 70,
        responsableId: usuarioTecnologia.id,
        evaluacionId: evaluaciones[2].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Respaldo de conexión 4G',
        descripcion: 'Enlace de respaldo por red móvil',
        tipoControl: TipoControl.DETECTIVO,
        frecuencia: 'Automático',
        eficacia: 45,
        responsableId: usuarioTecnologia.id,
        evaluacionId: evaluaciones[3].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Informes de ejecución mensuales',
        descripcion: 'Reportes automáticos de ejecución presupuestal',
        tipoControl: TipoControl.DETECTIVO,
        frecuencia: 'Mensual',
        eficacia: 55,
        responsableId: usuarioHacienda.id,
        evaluacionId: evaluaciones[4].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Auditoría al sistema de aseguramiento',
        descripcion: 'Auditoría externa semestral al sistema de aseguramiento en salud',
        tipoControl: TipoControl.DETECTIVO,
        frecuencia: 'Semestral',
        eficacia: 70,
        responsableId: usuarioSalud.id,
        evaluacionId: evaluaciones[5].id,
      },
    }),
    prisma.control.create({
      data: {
        nombre: 'Sistema de alertas de deserción',
        descripcion: 'Implementación de dashboard de indicadores educativos',
        tipoControl: TipoControl.PREVENTIVO,
        frecuencia: 'Mensual',
        eficacia: 50,
        responsableId: usuarioEducacion.id,
        evaluacionId: evaluaciones[6].id,
      },
    }),
  ]);

  // ============ PLANES DE ACCIÓN ============
  await Promise.all([
    prisma.planAccion.create({
      data: {
        riesgoId: riesgos[0].id,
        descripcion: 'Digitalizar el 100% de expedientes contractuales del año vigente',
        responsableId: usuarioArchivo.id,
        fechaLimite: new Date('2026-12-31'),
        estado: EstadoPlan.EN_EJECUCION,
      },
    }),
    prisma.planAccion.create({
      data: {
        riesgoId: riesgos[1].id,
        descripcion: 'Migrar sistema Orfeo a servidor actualizado con alta disponibilidad',
        responsableId: usuarioTecnologia.id,
        fechaLimite: new Date('2026-09-30'),
        estado: EstadoPlan.ABIERTO,
      },
    }),
    prisma.planAccion.create({
      data: {
        riesgoId: riesgos[2].id,
        descripcion: 'Implementar política de seguridad basada en modelo de confianza cero',
        responsableId: usuarioTecnologia.id,
        fechaLimite: new Date('2027-03-31'),
        estado: EstadoPlan.ABIERTO,
      },
    }),
    prisma.planAccion.create({
      data: {
        riesgoId: riesgos[6].id,
        descripcion: 'Diseñar e implementar programa de incentivos y plan de carrera',
        responsableId: usuarioTalento.id,
        fechaLimite: new Date('2026-08-31'),
        estado: EstadoPlan.EN_EJECUCION,
      },
    }),
    prisma.planAccion.create({
      data: {
        riesgoId: riesgos[7].id,
        descripcion: 'Realizar diagnóstico integral del sistema de aseguramiento en salud',
        responsableId: usuarioSalud.id,
        fechaLimite: new Date('2026-07-31'),
        estado: EstadoPlan.ABIERTO,
      },
    }),
    prisma.planAccion.create({
      data: {
        riesgoId: riesgos[8].id,
        descripcion: 'Implementar programa de retención escolar con alertas tempranas',
        responsableId: usuarioEducacion.id,
        fechaLimite: new Date('2026-11-30'),
        estado: EstadoPlan.ABIERTO,
      },
    }),
  ]);

  console.log('✅ Seed completado exitosamente');
  console.log(`   ${dependencias.length} dependencias`);
  console.log(`   ${usuarios.length} usuarios`);
   console.log(`   ${procesos.length} procesos`);
   console.log(`   ${subprocesosData.length} subprocesos`);
   console.log(`   ${activos.length} activos`);
  console.log(`   ${riesgos.length} riesgos`);
  console.log(`   ${evaluaciones.length} evaluaciones`);
  console.log('');
  console.log('🔐 Credenciales de prueba:');
  console.log('   Admin: admin@entidad.gov.co / Admin123!');
  console.log('   Todos los usuarios tienen contraseña: Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
