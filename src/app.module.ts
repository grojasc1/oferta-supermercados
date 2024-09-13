import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';

@Module({
  imports: [CiudadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
