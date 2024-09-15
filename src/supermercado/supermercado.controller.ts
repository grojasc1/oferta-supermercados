import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SupermercadoDto } from './supermercado.dto/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(
        private readonly supermercadoService: SupermercadoService
    ) {}

    @Get()
    async findAll() {
        return await this.supermercadoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.supermercadoService.findOne(id);
    }

    @Post()
    async create(@Body() supermercadoDto: SupermercadoDto) {
        const supermercado = plainToInstance(SupermercadoEntity, supermercadoDto);
        return await this.supermercadoService.create(supermercado);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() supermercadoDto: SupermercadoDto) {
        const supermercado = plainToInstance(SupermercadoEntity, supermercadoDto);
        return await this.supermercadoService.update(id, supermercado);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.supermercadoService.delete(id);
    }
}
