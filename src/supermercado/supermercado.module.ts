import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';

@Module({
  providers: [SupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
})
export class SupermercadoModule {}
