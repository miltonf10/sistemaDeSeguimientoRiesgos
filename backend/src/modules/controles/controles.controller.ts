import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ControlesService } from './controles.service';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('controles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ControlesController {
  constructor(private readonly controlesService: ControlesService) {}

  @Get('evaluacion/:evaluacionId')
  findByEvaluacion(@Param('evaluacionId') evaluacionId: string) {
    return this.controlesService.findByEvaluacion(evaluacionId);
  }

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  create(@Body() dto: CreateControlDto) {
    return this.controlesService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  update(@Param('id') id: string, @Body() dto: UpdateControlDto) {
    return this.controlesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  remove(@Param('id') id: string) {
    return this.controlesService.remove(id);
  }
}
