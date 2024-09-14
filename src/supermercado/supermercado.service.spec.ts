import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';


describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  //let supermercadosList: SupermercadoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
