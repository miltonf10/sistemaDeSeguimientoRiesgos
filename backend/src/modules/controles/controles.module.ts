import { Module } from '@nestjs/common';
import { ControlesController } from './controles.controller';
import { ControlesService } from './controles.service';

@Module({
  controllers: [ControlesController],
  providers: [ControlesService],
})
export class ControlesModule {}
