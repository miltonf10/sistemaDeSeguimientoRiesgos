import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('riesgos-por-proceso')
  riesgosPorProceso() {
    return this.reportesService.riesgosPorProceso();
  }

  @Get('riesgos-por-dependencia')
  riesgosPorDependencia() {
    return this.reportesService.riesgosPorDependencia();
  }

  @Get('riesgos-altos')
  riesgosAltos() {
    return this.reportesService.riesgosAltos();
  }

  @Post('activos-excel')
  async exportarActivosExcel(
    @Body() filtros: any,
    @Res() res: any,
  ) {
    const buffer = await this.reportesService.generarExcelActivos(filtros);
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=Inventario_Activos_Informacion_${fecha}.xlsx`,
      'Content-Length': buffer.length.toString(),
    });
    res.send(buffer);
  }
}
