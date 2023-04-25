import { Test, TestingModule } from '@nestjs/testing';
import { FixtureService } from '../fixture.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FixtureEntity } from '../fixture.entity';
import { mockRepository } from '../../../database/test/database.service.mock';

const moduleMocker = new ModuleMocker(global);

describe('FixtureService', () => {
  let fixtureService: FixtureService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FixtureService,
        {
          provide: getRepositoryToken(FixtureEntity),
          useValue: mockRepository,
        },
      ],
    })
      .useMocker((target) => {
        if (typeof target === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            target,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    fixtureService = app.get<FixtureService>(FixtureService);
  });

  it('should be defined', () => {
    expect(fixtureService).toBeDefined();
  });
});
