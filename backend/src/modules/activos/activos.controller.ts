import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('activos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivosController {
  constructor(private readonly activosService: ActivosService) {}

  @Get()
  findAll() {
    return this.activosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activosService.findOne(id);
  }

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  create(@Body() dto: CreateActivoDto) {
    return this.activosService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  update(@Param('id') id: string, @Body() dto: UpdateActivoDto) {
    return this.activosService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  remove(@Param('id') id: string) {
    return this.activosService.remove(id);
  }
}
