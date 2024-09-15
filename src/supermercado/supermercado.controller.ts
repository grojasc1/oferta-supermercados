import { Controller } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';

@Controller('supermarkets')
export class SupermercadoController {
    constructor(
        private readonly supermercadoService: SupermercadoService
    ) {}
}
