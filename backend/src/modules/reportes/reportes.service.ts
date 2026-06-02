import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  async riesgosPorProceso() {
    const procesos = await this.prisma.proceso.findMany({
      where: { activo: true },
      include: {
        _count: { select: { riesgos: true } },
      },
      orderBy: { nombre: 'asc' },
    });
    return procesos.map(p => ({
      proceso: p.nombre,
      codigo: p.codigo,
      totalRiesgos: p._count.riesgos,
    }));
  }

  async riesgosPorDependencia() {
    const dependencias = await this.prisma.dependencia.findMany({
      where: { activo: true },
      include: {
        macroprocesos: {
          include: {
            procesos: {
              include: {
                _count: { select: { riesgos: true } },
              },
            },
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
    return dependencias.map(d => ({
      dependencia: d.nombre,
      totalRiesgos: d.macroprocesos.reduce(
        (sum, m) => sum + m.procesos.reduce((s, p) => s + p._count.riesgos, 0),
        0
      ),
    }));
  }

  async riesgosAltos() {
    const evaluaciones = await this.prisma.evaluacionRiesgo.findMany({
      where: { riesgoInherente: { gte: 15 } },
      include: {
        riesgo: {
          include: {
            proceso: true,
            activo: true,
          },
        },
      },
      orderBy: { riesgoInherente: 'desc' },
    });
    return evaluaciones.map(e => ({
      riesgoId: e.riesgoId,
      riesgo: e.riesgo.nombre,
      proceso: e.riesgo.proceso.nombre,
      activo: e.riesgo.activo.nombre,
      probabilidad: e.probabilidad,
      impacto: e.impacto,
      riesgoInherente: e.riesgoInherente,
      fechaEvaluacion: e.fechaEvaluacion,
    }));
  }

  async generarExcelActivos(filtros: {
    dependenciaId?: string;
    macroprocesoId?: string;
    procesoId?: string;
    tipo?: string;
    criticidad?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<Buffer> {
    const where: any = { activo: true };

    if (filtros.dependenciaId) where.dependenciaId = filtros.dependenciaId;
    if (filtros.macroprocesoId) where.macroprocesoId = filtros.macroprocesoId;
    if (filtros.procesoId) where.procesoId = filtros.procesoId;
    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.criticidad) where.criticidad = filtros.criticidad;
    if (filtros.fechaDesde || filtros.fechaHasta) {
      where.createdAt = {};
      if (filtros.fechaDesde) where.createdAt.gte = new Date(filtros.fechaDesde);
      if (filtros.fechaHasta) where.createdAt.lte = new Date(filtros.fechaHasta);
    }

    const activos = await this.prisma.activo.findMany({
      where,
      include: {
        dependencia: true,
        macroproceso: true,
        proceso: true,
        subprocesoRel: true,
        responsable: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const wb = new ExcelJS.Workbook();
    wb.creator = 'SRIESGO';
    wb.created = new Date();

    const ws = wb.addWorksheet('Inventario Activos');

    const blueFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
    const grayFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

    const whiteFont: Partial<ExcelJS.Font> = { color: { argb: 'FFFFFFFF' }, bold: true, size: 10 };
    const blackFont: Partial<ExcelJS.Font> = { color: { argb: 'FF000000' }, bold: true, size: 9 };
    const dataFont: Partial<ExcelJS.Font> = { size: 9 };

    const headerBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const wrapAlignment: Partial<ExcelJS.Alignment> = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    const dataAlignment: Partial<ExcelJS.Alignment> = { wrapText: true, vertical: 'top' };

    const group1Cols = [
      'Proceso', 'Subproceso', 'Código del sistema de gestión documental',
      'Identificador', 'Tipo', 'Dependencia', 'Serie documental', 'Subserie documental',
      'Nombre', 'Descripción', 'Cargo de la producción de la información\n(Propietario del activo)',
      'Fecha de generación de la información', 'Cargo de la persona encargada de la información\n(Custodio del activo)',
      'Fecha de ingreso del activo al archivo', 'Soporte de registro', 'Medio de conservación',
      'Formato', 'Idioma',
    ];
    const group2Cols = ['Confidencialidad', 'Integridad', 'Disponibilidad'];
    const group3Cols = [
      'Información publicada', 'Lugar de consulta o ubicación',
      'Objeto legítimo de la excepción', 'Fundamento constitucional o legal',
      'Fundamento jurídico de la excepción', 'Excepción total o parcial',
      'Fecha de clasificación\n(DD/MM/AAAA)', 'Tiempo de clasificación',
    ];
    const group4Cols = [
      '¿Contiene datos personales?', '¿Contiene datos personales de niños,\nniñas o adolescentes?',
      'Tipos de datos personales', 'Finalidad de la recolección\nde los datos personales',
      'Existe la autorización para el tratamiento\nde los datos personales',
    ];

    const allCols = [...group1Cols, ...group2Cols, ...group3Cols, ...group4Cols];
    const totalCols = allCols.length;

    ws.columns = allCols.map((_, i) => ({ width: Math.max(18, 28 - Math.floor(i / 4)) }));

    const titleRow = ws.addRow([]);
    ws.mergeCells(1, 1, 1, totalCols);
    titleRow.getCell(1).value = 'FORMATO DE GESTIÓN Y CLASIFICACIÓN DE ACTIVOS DE INFORMACIÓN';
    titleRow.getCell(1).font = { bold: true, size: 14, color: { argb: 'FF003366' } };
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 30;

    const metaRow = ws.addRow([
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '',
      '', '', '', '', '', '', '',
      '', '', '', '', '',
      'Código: GIC-TEI-F-09',
    ]);
    ws.mergeCells(2, 1, 2, totalCols - 1);
    metaRow.getCell(1).value = '';
    metaRow.getCell(totalCols).font = { size: 8, color: { argb: 'FF666666' } };
    metaRow.getCell(totalCols).alignment = { horizontal: 'right' };
    metaRow.height = 14;

    const group1End = group1Cols.length;
    const group2End = group1End + group2Cols.length;
    const group3End = group2End + group3Cols.length;

    const headerRow = ws.addRow(allCols.map(() => ''));
    headerRow.height = 22;

    const g1Header = headerRow.getCell(1);
    g1Header.value = 'IDENTIFICACIÓN DEL ACTIVO DE INFORMACIÓN (LEY 594 DE 2000 - LEY 1712 DE 2014 - DECRETO 103 DE 2015 - DECRETO 1080 DE 2015 - ISO 27001)';
    ws.mergeCells(3, 1, 3, group1End);
    g1Header.fill = blueFill;
    g1Header.font = whiteFont;
    g1Header.alignment = wrapAlignment;
    g1Header.border = headerBorder;

    const g2Header = headerRow.getCell(group1End + 1);
    g2Header.value = 'CLASIFICACIÓN DEL ACTIVO DE INFORMACIÓN (ISO 27001)';
    ws.mergeCells(3, group1End + 1, 3, group2End);
    g2Header.fill = blueFill;
    g2Header.font = whiteFont;
    g2Header.alignment = wrapAlignment;
    g2Header.border = headerBorder;

    const g3Header = headerRow.getCell(group2End + 1);
    g3Header.value = 'ÍNDICE DE INFORMACIÓN CLASIFICADA Y RESERVADA (DECRETO 103 DE 2015)';
    ws.mergeCells(3, group2End + 1, 3, group3End);
    g3Header.fill = blueFill;
    g3Header.font = whiteFont;
    g3Header.alignment = wrapAlignment;
    g3Header.border = headerBorder;

    const g4Header = headerRow.getCell(group3End + 1);
    g4Header.value = 'DATOS PERSONALES (LEY 1581 DE 2012)';
    ws.mergeCells(3, group3End + 1, 3, totalCols);
    g4Header.fill = blueFill;
    g4Header.font = whiteFont;
    g4Header.alignment = wrapAlignment;
    g4Header.border = headerBorder;

    const colHeaderRow = ws.addRow(allCols);
    colHeaderRow.height = 36;
    colHeaderRow.eachCell((cell) => {
      cell.fill = grayFill;
      cell.font = blackFont;
      cell.alignment = wrapAlignment;
      cell.border = headerBorder;
    });

    ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: totalCols } };
    ws.views = [{ state: 'frozen', ySplit: 4 }];

    const fmtDate = (d: any): string => {
      if (!d) return '—';
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? '—' : dt.toLocaleDateString('es-CO', { timeZone: 'UTC' });
    };

    const fmtBool = (v: any): string => {
      if (v === true || v === 'true') return 'Sí';
      if (v === false || v === 'false') return 'No';
      return '—';
    };

    for (const a of activos) {
      const row = ws.addRow([
        a.proceso?.nombre || '—',
        a.subprocesoRel?.nombre || '—',
        a.codigoGestionDocumental || '—',
        a.identificador || '—',
        a.tipo || '—',
        a.dependencia?.nombre || '—',
        a.serieDocumental || '—',
        a.subserieDocumental || '—',
        a.nombre || '—',
        a.descripcion || '—',
        a.propietarioCargo || '—',
        fmtDate(a.fechaGeneracion),
        a.custodioCargo || '—',
        fmtDate(a.fechaIngresoArchivo),
        a.soporteRegistro || '—',
        a.medioConservacion || '—',
        a.formato || '—',
        a.idioma || '—',

        a.confidencialidad || '—',
        a.integridad || '—',
        a.disponibilidad || '—',

        fmtBool(a.informacionPublicada),
        a.lugarConsulta || '—',
        a.objetoLegitimoExcepcion || '—',
        a.fundamentoConstitucionalLegal || '—',
        a.fundamentoJuridicoExcepcion || '—',
        a.excepcionTotalParcial || '—',
        fmtDate(a.fechaClasificacion),
        a.tiempoClasificacion || '—',

        fmtBool(a.contieneDatosPersonales),
        fmtBool(a.contieneDatosMenores),
        a.tiposDatosPersonales || '—',
        a.finalidadTratamiento || '—',
        fmtBool(a.existeAutorizacionTratamiento),
      ]);

      row.height = 20;
      row.eachCell((cell) => {
        cell.font = dataFont;
        cell.alignment = dataAlignment;
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }
}
