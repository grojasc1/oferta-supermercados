import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadDto } from './ciudad.dto/ciudad.dto';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { plainToInstance } from 'class-transformer';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(
        private readonly ciudadService: CiudadService,
    ) {}

    @Get()
    async findAll() {
        return await this.ciudadService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.ciudadService.findOne(id);
    }

    @Post()
    async create(@Body() ciudadDto: CiudadDto) {
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
        return await this.ciudadService.create(ciudad);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() ciudadDto: CiudadDto) {
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
        return await this.ciudadService.update(id, ciudad);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.ciudadService.delete(id);
    }
}
