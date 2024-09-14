import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';


describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: "Supermercado " + faker.company.name(),
        latitud: faker.address.latitude(),
        longitud: faker.address.longitude(),
        paginaWeb: faker.internet.url(),
      });
      supermercadosList.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre);
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud);
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud);
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('create should return a new supermarket', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.address.latitude(),
      longitud: faker.address.longitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []
    };
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: newSupermercado.id}});
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre);
    expect(storedSupermercado.latitud).toEqual(newSupermercado.latitud);
    expect(storedSupermercado.longitud).toEqual(newSupermercado.longitud);
    expect(storedSupermercado.paginaWeb).toEqual(newSupermercado.paginaWeb);
  });

  it('update should modify a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = "Nuevo Supermercado " + faker.company.name();
    supermercado.latitud = faker.address.latitude();
    supermercado.longitud = faker.address.longitude();
    supermercado.paginaWeb = faker.internet.url();

    const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: updatedSupermercado.id}});
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb);
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: "Nuevo Supermercado " + faker.company.name(), latitud: faker.address.latitude(), longitud: faker.address.longitude(), paginaWeb: faker.internet.url()
    }
    await expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('delete should remove a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: supermercado.id}});
    expect(deletedSupermercado).toBeUndefined();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });
});
