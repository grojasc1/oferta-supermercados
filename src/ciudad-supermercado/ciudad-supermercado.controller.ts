import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoDto } from '../supermercado/supermercado.dto/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(
        private readonly ciudadSupermercadoservice: CiudadSupermercadoService
    ) {}

    @Post(':ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string) {
        return await this.ciudadSupermercadoservice.addSupermarketToCity(ciudadId, supermercadoId);
    }

    @Get(':ciudadId/supermarkets')
    async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string) {
        return await this.ciudadSupermercadoservice.findSupermarketsFromCity(ciudadId);
    }

    @Get(':ciudadId/supermarkets/:supermercadoId')
    async findSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string) {
        return await this.ciudadSupermercadoservice.findSupermarketFromCity(ciudadId, supermercadoId);
    }

    @Put(':ciudadId/supermarkets')
    async updateSupermarketFromCity(@Body() supermercadosDto: SupermercadoDto[], @Param('ciudadId') ciudadId: string) {
        const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto);
        return await this.ciudadSupermercadoservice.updateSupermarketFromCity(ciudadId, supermercados);
    }

    @Delete(':ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string) {
        return await this.ciudadSupermercadoservice.deleteSupermarketFromCity(ciudadId, supermercadoId);
    }
}
