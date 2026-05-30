import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
