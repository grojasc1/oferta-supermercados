import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
    ) {}

    async addSupermarketToCity(ciudadId: string, supermercadoId: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ['supermercados']});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);

        ciudad.supermercados = [...ciudad.supermercados, supermercado];
        return await this.ciudadRepository.save(ciudad);
    }

    async findSupermarketsFromCity(ciudadId: string): Promise<SupermercadoEntity[]> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ['supermercados']});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        return ciudad.supermercados;   
    }

    async findSupermarketFromCity(ciudadId: string, supermercadoId: string): Promise<SupermercadoEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ['supermercados']});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!persistedSupermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const supermercado: SupermercadoEntity = ciudad.supermercados.find(supermercado => supermercado.id === supermercadoId);
        if (!supermercado)
            throw new BusinessLogicException("El supermercado no pertenece a la ciudad proporcionada", BusinessError.NOT_FOUND);
        return supermercado;
    }

    async updateSupermarketFromCity(ciudadId: string, supermercados: SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ['supermercados']});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        
        for (const supermercado of supermercados) {
            const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercado.id}});
            if (!persistedSupermercado)
                throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);   
        }

        ciudad.supermercados = supermercados;
        return await this.ciudadRepository.save(ciudad);
    }

    async deleteSupermarketFromCity(ciudadId: string, supermercadoId: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ['supermercados']});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!persistedSupermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const supermercadoIndex: number = ciudad.supermercados.findIndex(supermercado => supermercado.id === supermercadoId);
        if (supermercadoIndex === -1)
            throw new BusinessLogicException("El supermercado no está asociado a la ciudad", BusinessError.NOT_FOUND);

        ciudad.supermercados.splice(supermercadoIndex, 1);
        return await this.ciudadRepository.save(ciudad);
    }
}
