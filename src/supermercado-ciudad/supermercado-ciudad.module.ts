import { Module } from '@nestjs/common';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { SupermercadoCiudadController } from './supermercado-ciudad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity])],
  providers: [SupermercadoCiudadService],
  controllers: [SupermercadoCiudadController]
})
export class SupermercadoCiudadModule {}
