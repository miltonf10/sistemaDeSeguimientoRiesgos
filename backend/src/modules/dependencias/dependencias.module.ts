import { Module } from '@nestjs/common';
import { DependenciasController } from './dependencias.controller';
import { DependenciasService } from './dependencias.service';

@Module({
  controllers: [DependenciasController],
  providers: [DependenciasService],
})
export class DependenciasModule {}
