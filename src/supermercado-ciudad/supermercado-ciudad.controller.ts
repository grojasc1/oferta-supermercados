import { Controller } from '@nestjs/common';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Controller('supermarkets')
export class SupermercadoCiudadController {
    constructor(
        private readonly supermercadoCiudadService: SupermercadoCiudadService
    ) {}
}
