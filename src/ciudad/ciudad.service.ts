import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class CiudadService {
    private paisesPermitidos: string[] = ['Argentina', 'Ecuador', 'Paraguay']

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({relations: ['supermercados']});
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ['supermercados']});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        if (!this.paisesPermitidos.includes(ciudad.pais)) {
            throw new BusinessLogicException(`El país ${ciudad.pais} no es válido`, BusinessError.PRECONDITION_FAILED);
        }

        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
        if (!persistedCiudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);
        else if (!this.paisesPermitidos.includes(ciudad.pais))
            throw new BusinessLogicException(`El país ${ciudad.pais} no es válido`, BusinessError.PRECONDITION_FAILED);

        ciudad.id = id;

        return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no existe", BusinessError.NOT_FOUND);

        await this.ciudadRepository.remove(ciudad);
    }
}
