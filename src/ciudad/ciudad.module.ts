import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';

@Module({
  providers: [CiudadService],
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
})
export class CiudadModule {}
