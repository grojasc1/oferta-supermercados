import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('SupermercadoCiudadService', () => {
  let service: SupermercadoCiudadService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercado: SupermercadoEntity;
  let ciudadesList: CiudadEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoCiudadService],
    }).compile();

    service = module.get<SupermercadoCiudadService>(SupermercadoCiudadService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad = await ciudadRepository.save({
        nombre: "Ciudad " + faker.location.city(),
        pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
        num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
      });
      ciudadesList.push(ciudad);
    }

    supermercado = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
      ciudades: ciudadesList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCityToSupermarket should return a supermarket with a new city', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      nombre: "Ciudad " + faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
    });

    const updatedSupermercado = await service.addCityToSupermarket(supermercado.supermercadoId, ciudad.ciudadId);
    expect(updatedSupermercado.ciudades.length).toEqual(ciudadesList.length + 1);
  });

  it('addCityToSupermarket should throw an exception for an invalid supermarket', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      nombre: "Ciudad " + faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
    });

    await expect(() => service.addCityToSupermarket("0", ciudad.ciudadId)).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('addCityToSupermarket should throw an exception for an invalid city', async () => {
    await expect(() => service.addCityToSupermarket(supermercado.supermercadoId, "0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('findCitiesBySupermarket should return a list of cities from a supermarket', async () => {
    const ciudades = await service.findCitiesFromSupermarket(supermercado.supermercadoId);
    expect(ciudades.length).toEqual(ciudadesList.length);
  });

  it('findCitiesBySupermarket should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findCitiesFromSupermarket("0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('findCityFromSupermarket should return a city from a supermarket', async () => {
    const ciudad = ciudadesList[0];
    const storedCiudad = await service.findCityFromSupermarket(supermercado.supermercadoId, ciudad.ciudadId);
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre);
    expect(storedCiudad.pais).toEqual(ciudad.pais);
    expect(storedCiudad.num_habitantes).toEqual(ciudad.num_habitantes);
  });

  it('findCityFromSupermarket should throw an exception for an invalid supermarket', async () => {
    const ciudad = ciudadesList[0];
    await expect(() => service.findCityFromSupermarket("0", ciudad.ciudadId)).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('findCityFromSupermarket should throw an exception for an invalid city', async () => {
    await expect(() => service.findCityFromSupermarket(supermercado.supermercadoId, "0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('findCityFromSupermarket should throw an exception for a non associated city', async () => {
    const ciudad = await ciudadRepository.save({
      nombre: "Ciudad " + faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
    });

    await expect(() => service.findCityFromSupermarket(supermercado.supermercadoId, ciudad.ciudadId)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no está asociada al supermercado");
  });

  it('updateCityFromSupermarket should return a supermarket with an updated city', async () => {
    const ciudad = await ciudadRepository.save({
      nombre: "Ciudad " + faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
    });

    const updatedSupermercado = await service.updateCityFromSupermarket(supermercado.supermercadoId, [ciudad])
    expect(updatedSupermercado.ciudades.length).toEqual(1);
    expect(updatedSupermercado.ciudades[0].nombre).toEqual(ciudad.nombre);
    expect(updatedSupermercado.ciudades[0].pais).toEqual(ciudad.pais);
    expect(updatedSupermercado.ciudades[0].num_habitantes).toEqual(ciudad.num_habitantes);
  });

  it('updateCityFromSupermarket should throw an exception for an invalid supermarket', async () => {
    const ciudad = await ciudadRepository.save({
      nombre: "Ciudad " + faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
    });

    await expect(() => service.updateCityFromSupermarket("0", [ciudad])).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('updateCityFromSupermarket should throw an exception for an invalid city', async () => {
    const ciudad = await ciudadRepository.save({
      nombre: "Ciudad " + faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
    });

    await expect(() => service.updateCityFromSupermarket(supermercado.supermercadoId, [ciudad, {ciudadId: "0"} as CiudadEntity])).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('deleteCityFromSupermarket should return a supermarket without a city', async () => {
    const ciudad = ciudadesList[0];
    await service.deleteCityFromSupermarket(supermercado.supermercadoId, ciudad.ciudadId);

    const storedSupermercado = await supermercadoRepository.findOne({where: {supermercadoId: supermercado.supermercadoId}, relations: ["ciudades"]});
    const deletedCiudad = storedSupermercado.ciudades.find(c => c.ciudadId === ciudad.ciudadId);
    expect(deletedCiudad).toBeUndefined();
  });

  it('deleteCityFromSupermarket should throw an exception for an invalid supermarket', async () => {
    const ciudad = ciudadesList[0];
    await expect(() => service.deleteCityFromSupermarket("0", ciudad.ciudadId)).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('deleteCityFromSupermarket should throw an exception for an invalid city', async () => {
    await expect(() => service.deleteCityFromSupermarket(supermercado.supermercadoId, "0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('deleteCityFromSupermarket should throw an exception for a non associated city', async () => {
    const ciudad = await ciudadRepository.save({
      nombre: "Ciudad " + faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
    });

    await expect(() => service.deleteCityFromSupermarket(supermercado.supermercadoId, ciudad.ciudadId)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no está asociada al supermercado");
  });

});
