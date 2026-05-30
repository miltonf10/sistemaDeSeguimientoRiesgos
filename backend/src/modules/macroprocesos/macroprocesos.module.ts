import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MacroprocesosController } from './macroprocesos.controller';
import { MacroprocesosService } from './macroprocesos.service';

@Module({
  imports: [PrismaModule],
  controllers: [MacroprocesosController],
  providers: [MacroprocesosService],
  exports: [MacroprocesosService],
})
export class MacroprocesosModule {}
