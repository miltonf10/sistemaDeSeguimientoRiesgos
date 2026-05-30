import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DependenciasService } from './dependencias.service';
import { CreateDependenciaDto } from './dto/create-dependencia.dto';
import { UpdateDependenciaDto } from './dto/update-dependencia.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('dependencias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DependenciasController {
  constructor(private readonly dependenciasService: DependenciasService) {}

  @Get()
  findAll() {
    return this.dependenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dependenciasService.findOne(id);
  }

  @Post()
  @Roles(Rol.ADMINISTRADOR)
  create(@Body() dto: CreateDependenciaDto) {
    return this.dependenciasService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR)
  update(@Param('id') id: string, @Body() dto: UpdateDependenciaDto) {
    return this.dependenciasService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  remove(@Param('id') id: string) {
    return this.dependenciasService.remove(id);
  }
}
