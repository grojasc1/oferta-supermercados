import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoCiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
    ) {}

    async addCityToSupermarket(supermercadoId: string, ciudadId: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}, relations: ['ciudades']});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);

        supermercado.ciudades = [...supermercado.ciudades, ciudad];
        return await this.supermercadoRepository.save(supermercado);
    }

    async findCitiesFromSupermarket(supermercadoId: string): Promise<CiudadEntity[]> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}, relations: ['ciudades']});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        return supermercado.ciudades;   
    }

    async findCityFromSupermarket(supermercadoId: string, ciudadId: string): Promise<CiudadEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}, relations: ['ciudades']});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}});
        if (!persistedCiudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const ciudad: CiudadEntity = supermercado.ciudades.find(ciudad => ciudad.id === ciudadId);
        if (!ciudad)
            throw new BusinessLogicException("La ciudad no pertenece al supermercado proporcionado", BusinessError.NOT_FOUND);
        return ciudad;
    }

    async updateCityFromSupermarket(supermercadoId: string, ciudades: CiudadEntity[]): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}, relations: ['ciudades']});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        
        for (const ciudad of ciudades) {
            const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudad.id}});
            if (!persistedCiudad)
                throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);   
        }

        supermercado.ciudades = ciudades;
        return await this.supermercadoRepository.save(supermercado);
    }

    async deleteCityFromSupermarket(supermercadoId: string, ciudadId: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}, relations: ['ciudades']});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}});
        if (!persistedCiudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        const ciudadIndex: number = supermercado.ciudades.findIndex(ciudad => ciudad.id === ciudadId);
        if (ciudadIndex === -1)
            throw new BusinessLogicException("La ciudad no pertenece al supermercado proporcionado", BusinessError.NOT_FOUND);

        supermercado.ciudades.splice(ciudadIndex, 1);
        return await this.supermercadoRepository.save(supermercado);
    }
}
