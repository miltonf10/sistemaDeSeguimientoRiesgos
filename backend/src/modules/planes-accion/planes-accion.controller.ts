import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PlanesAccionService } from './planes-accion.service';
import { CreatePlanAccionDto } from './dto/create-plan-accion.dto';
import { UpdatePlanAccionDto } from './dto/update-plan-accion.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('planes-accion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanesAccionController {
  constructor(private readonly planesAccionService: PlanesAccionService) {}

  @Get()
  findAll() {
    return this.planesAccionService.findAll();
  }

  @Get('riesgo/:riesgoId')
  findByRiesgo(@Param('riesgoId') riesgoId: string) {
    return this.planesAccionService.findByRiesgo(riesgoId);
  }

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  create(@Body() dto: CreatePlanAccionDto) {
    return this.planesAccionService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  update(@Param('id') id: string, @Body() dto: UpdatePlanAccionDto) {
    return this.planesAccionService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  remove(@Param('id') id: string) {
    return this.planesAccionService.remove(id);
  }
}
