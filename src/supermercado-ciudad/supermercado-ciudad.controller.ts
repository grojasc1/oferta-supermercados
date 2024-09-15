import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { CiudadDto } from 'src/ciudad/ciudad.dto/ciudad.dto';
import { plainToInstance } from 'class-transformer';
import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';

@Controller('supermarkets')
export class SupermercadoCiudadController {
    constructor(
        private readonly supermercadoCiudadService: SupermercadoCiudadService
    ) {}

    @Post(':supermercadoId/cities/:ciudadId')
    async addCityToSupermarket(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string) {
        return await this.supermercadoCiudadService.addCityToSupermarket(supermercadoId, ciudadId);
    }

    @Get(':supermercadoId/cities')
    async findCitiesFromSupermarket(@Param('supermercadoId') supermercadoId: string) {
        return await this.supermercadoCiudadService.findCitiesFromSupermarket(supermercadoId);
    }

    @Get(':supermercadoId/cities/:ciudadId')
    async findCityFromSupermarket(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string) {
        return await this.supermercadoCiudadService.findCityFromSupermarket(supermercadoId, ciudadId);
    }

    @Put(':supermercadoId/cities')
    async updateCityFromSupermarket(@Body() ciudadesDto: CiudadDto[], @Param('supermercadoId') supermercadoId: string) {
        const ciudades = plainToInstance(CiudadEntity, ciudadesDto);
        return await this.supermercadoCiudadService.updateCityFromSupermarket(supermercadoId, ciudades);
    }

    @Delete(':supermercadoId/cities/:ciudadId')
    @HttpCode(204)
    async deleteCityFromSupermarket(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string) {
        return await this.supermercadoCiudadService.deleteCityFromSupermarket(supermercadoId, ciudadId);
    }
}
