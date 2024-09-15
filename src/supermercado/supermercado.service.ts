import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {

    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ) {}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({relations: ['ciudades']});
    }

    async findOne(supermercadoId: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {supermercadoId}, relations: ['ciudades']});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        return supermercado;
    }

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if (supermercado.nombre.length <= 10) {
            throw new BusinessLogicException("El nombre del supermercado debe tener más de 10 caracteres", BusinessError.PRECONDITION_FAILED);
        }

        return await this.supermercadoRepository.save(supermercado);
    }

    async update(supermercadoId: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {supermercadoId}});
        if (!persistedSupermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        else if (supermercado.nombre.length <= 10)
            throw new BusinessLogicException("El nombre del supermercado debe tener más de 10 caracteres", BusinessError.PRECONDITION_FAILED);

        supermercado.supermercadoId = supermercadoId;

        return await this.supermercadoRepository.save({...persistedSupermercado, ...supermercado});
    }

    async delete(supermercadoId: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {supermercadoId}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);

        await this.supermercadoRepository.remove(supermercado);
    }
}
