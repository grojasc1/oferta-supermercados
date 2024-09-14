import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';

@Module({
  providers: [SupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
})
export class SupermercadoModule {}
