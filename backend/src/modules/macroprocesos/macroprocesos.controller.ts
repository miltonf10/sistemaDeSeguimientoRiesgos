import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MacroprocesosService } from './macroprocesos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('macroprocesos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MacroprocesosController {
  constructor(private readonly macroprocesosService: MacroprocesosService) {}

  @Get()
  findAll() {
    return this.macroprocesosService.findAll();
  }

  @Get('por-dependencia/:dependenciaId')
  findByDependencia(@Param('dependenciaId') dependenciaId: string) {
    return this.macroprocesosService.findByDependencia(dependenciaId);
  }
}
