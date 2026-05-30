import { Module } from '@nestjs/common';
import { PlanesAccionController } from './planes-accion.controller';
import { PlanesAccionService } from './planes-accion.service';

@Module({
  controllers: [PlanesAccionController],
  providers: [PlanesAccionService],
})
export class PlanesAccionModule {}
