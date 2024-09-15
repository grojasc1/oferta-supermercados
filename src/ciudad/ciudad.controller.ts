import { Controller } from '@nestjs/common';
import { CiudadService } from './ciudad.service';

@Controller('cities')
export class CiudadController {
    constructor(
        private readonly ciudadService: CiudadService,
    ) {}
}
