import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import envConfig from './config/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { DependenciasModule } from './modules/dependencias/dependencias.module';
import { ProcesosModule } from './modules/procesos/procesos.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ActivosModule } from './modules/activos/activos.module';
import { RiesgosModule } from './modules/riesgos/riesgos.module';
import { EvaluacionesModule } from './modules/evaluaciones/evaluaciones.module';
import { ControlesModule } from './modules/controles/controles.module';
import { PlanesAccionModule } from './modules/planes-accion/planes-accion.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { ReportesModule } from './modules/reportes/reportes.module';
import { MacroprocesosModule } from './modules/macroprocesos/macroprocesos.module';
import { SubprocesosModule } from './modules/subprocesos/subprocesos.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    PrismaModule,
    AuthModule,
    DependenciasModule,
    ProcesosModule,
    UsuariosModule,
    ActivosModule,
    RiesgosModule,
    EvaluacionesModule,
    ControlesModule,
    PlanesAccionModule,
    AuditoriaModule,
    ReportesModule,
    MacroprocesosModule,
    SubprocesosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
