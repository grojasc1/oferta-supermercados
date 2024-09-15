import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadService } from '../ciudad/ciudad.service';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
        num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
      });
      ciudadesList.push(ciudad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.ciudadId);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
    expect(ciudad.pais).toEqual(storedCiudad.pais);
    expect(ciudad.num_habitantes).toEqual(storedCiudad.num_habitantes);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      ciudadId: "",
      nombre: faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
      supermercados: []
    };

    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await repository.findOne({where: {ciudadId: newCiudad.ciudadId}}); 
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre);
    expect(storedCiudad.pais).toEqual(newCiudad.pais);
    expect(storedCiudad.num_habitantes).toEqual(newCiudad.num_habitantes);
  });

  it('update should modify a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "New City Name";
    ciudad.pais = ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })];
    ciudad.num_habitantes = faker.number.int({ min: 1000, max: 1000000 });
    const updatedCiudad: CiudadEntity = await service.update(ciudad.ciudadId, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({where: {ciudadId: updatedCiudad.ciudadId}});
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre);
    expect(storedCiudad.pais).toEqual(ciudad.pais);
    expect(storedCiudad.num_habitantes).toEqual(ciudad.num_habitantes);
  });

  it('update should throw an exception for an invalid city', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, nombre: "New City Name", pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })], num_habitantes: faker.number.int({ min: 1000, max: 1000000 })
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('delete should remove a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.ciudadId);
    const deletedCiudad: CiudadEntity = await repository.findOne({where: {ciudadId: ciudad.ciudadId}});
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });
});
