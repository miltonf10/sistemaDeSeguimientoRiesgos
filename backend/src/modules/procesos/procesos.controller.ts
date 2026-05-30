import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProcesosService } from './procesos.service';
import { CreateProcesoDto } from './dto/create-proceso.dto';
import { UpdateProcesoDto } from './dto/update-proceso.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('procesos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcesosController {
  constructor(private readonly procesosService: ProcesosService) {}

  @Get()
  findAll() {
    return this.procesosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.procesosService.findOne(id);
  }

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  create(@Body() dto: CreateProcesoDto) {
    return this.procesosService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  update(@Param('id') id: string, @Body() dto: UpdateProcesoDto) {
    return this.procesosService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  remove(@Param('id') id: string) {
    return this.procesosService.remove(id);
  }
}
