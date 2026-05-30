import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SubprocesosController } from './subprocesos.controller';
import { SubprocesosService } from './subprocesos.service';

@Module({
  imports: [PrismaModule],
  controllers: [SubprocesosController],
  providers: [SubprocesosService],
  exports: [SubprocesosService],
})
export class SubprocesosModule {}
