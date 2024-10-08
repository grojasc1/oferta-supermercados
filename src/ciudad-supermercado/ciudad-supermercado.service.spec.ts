import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CiudadSupermercadoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado = await supermercadoRepository.save({
        nombre: "Supermercado " + faker.company.name(),
        latitud: i,
        longitud: i,
        paginaWeb: faker.internet.url(),
      });
      supermercadosList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: ["Argentina", "Ecuador", "Paraguay"][faker.number.int({ min: 0, max: 2 })],
      num_habitantes: faker.number.int({ min: 1000, max: 1000000 }),
      supermercados: supermercadosList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should return a city with a new supermarket', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });

    const updatedCiudad: CiudadEntity = await service.addSupermarketToCity(ciudad.ciudadId, supermercado.supermercadoId);
    expect(updatedCiudad.supermercados.length).toEqual(supermercadosList.length + 1);
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() => service.addSupermarketToCity("0", supermercado.supermercadoId)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('addSupermarketToCity should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.addSupermarketToCity(ciudad.ciudadId, "0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('findSupermarketsFromCity should return a list of supermarkets from a city', async () => {
    const supermercados = await service.findSupermarketsFromCity(ciudad.ciudadId);
    expect(supermercados.length).toEqual(supermercadosList.length);
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() => service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('findSupermarketFromCity should return a supermarket from a city', async () => {
    const supermercado = supermercadosList[0];
    const storedSupermercado = await service.findSupermarketFromCity(ciudad.ciudadId, supermercado.supermercadoId);
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb);
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado = supermercadosList[0];
    await expect(() => service.findSupermarketFromCity("0", supermercado.supermercadoId)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findSupermarketFromCity(ciudad.ciudadId, "0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('findSupermarketFromCity should throw an exception for a non associated supermarket', async () => {
    const supermercado = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() => service.findSupermarketFromCity(ciudad.ciudadId, supermercado.supermercadoId)).rejects.toHaveProperty("message", "El supermercado no pertenece a la ciudad proporcionada");
  });

  it('updateSupermarketFromCity should return a city with the supermarkets updated', async () => { 
    const supermercado = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });

    const updatedCiudad: CiudadEntity = await service.updateSupermarketFromCity(ciudad.ciudadId, [supermercado]);
    expect(updatedCiudad.supermercados.length).toEqual(1);
    expect(updatedCiudad.supermercados[0].nombre).toEqual(supermercado.nombre);
    expect(updatedCiudad.supermercados[0].latitud).toEqual(supermercado.latitud);
    expect(updatedCiudad.supermercados[0].longitud).toEqual(supermercado.longitud);
    expect(updatedCiudad.supermercados[0].paginaWeb).toEqual(supermercado.paginaWeb);
  });

  it('updateSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() => service.updateSupermarketFromCity("0", [supermercado])).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('updateSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    const supermercado = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });
    
    await expect(() => service.updateSupermarketFromCity(ciudad.ciudadId, [supermercado, {supermercadoId: "0"} as SupermercadoEntity])).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('deleteSupermarketFromCity should delete a supermarket from a city', async () => {
    const supermercado = supermercadosList[0];
    await service.deleteSupermarketFromCity(ciudad.ciudadId, supermercado.supermercadoId);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {ciudadId: ciudad.ciudadId}, relations: ["supermercados"]});
    const deletedSupermercado = storedCiudad.supermercados.find(s => s.supermercadoId === supermercado.supermercadoId);
    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado = supermercadosList[0];
    await expect(() => service.deleteSupermarketFromCity("0", supermercado.supermercadoId)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no existe");
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.deleteSupermarketFromCity(ciudad.ciudadId, "0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no existe");
  });

  it('deleteSupermarketFromCity should throw an exception for a non associated supermarket', async () => {
    const supermercado = await supermercadoRepository.save({
      nombre: "Supermercado " + faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });

    await expect(() => service.deleteSupermarketFromCity(ciudad.ciudadId, supermercado.supermercadoId)).rejects.toHaveProperty("message", "El supermercado no está asociado a la ciudad");
  });
});
