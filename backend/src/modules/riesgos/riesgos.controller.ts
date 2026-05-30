import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RiesgosService } from './riesgos.service';
import { CreateRiesgoDto } from './dto/create-riesgo.dto';
import { UpdateRiesgoDto } from './dto/update-riesgo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('riesgos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RiesgosController {
  constructor(private readonly riesgosService: RiesgosService) {}

  @Get()
  findAll() {
    return this.riesgosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.riesgosService.findOne(id);
  }

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  create(@Body() dto: CreateRiesgoDto) {
    return this.riesgosService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  update(@Param('id') id: string, @Body() dto: UpdateRiesgoDto) {
    return this.riesgosService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  remove(@Param('id') id: string) {
    return this.riesgosService.remove(id);
  }
}
