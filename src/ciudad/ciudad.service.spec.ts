import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadService } from '../ciudad/ciudad.service';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

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
    //await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
