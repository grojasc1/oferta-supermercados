import { Module } from '@nestjs/common';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity])],
  providers: [SupermercadoCiudadService]
})
export class SupermercadoCiudadModule {}
