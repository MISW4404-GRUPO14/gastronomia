import { Test, TestingModule } from '@nestjs/testing';
import { CulturasController } from './culturas.controller';
import { CulturasService } from './culturas.service';

describe('CulturasController', () => {
  let controller: CulturasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturasController],
      providers: [CulturasService],
    }).compile();

    controller = module.get<CulturasController>(CulturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
