import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SubprocesosService } from './subprocesos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('subprocesos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubprocesosController {
  constructor(private readonly subprocesosService: SubprocesosService) {}

  @Get()
  findAll() {
    return this.subprocesosService.findAll();
  }

  @Get('por-proceso/:procesoId')
  findByProceso(@Param('procesoId') procesoId: string) {
    return this.subprocesosService.findByProceso(procesoId);
  }
}
