import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('HealthModule', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
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

    healthController = app.get<HealthController>(HealthController);
  });

  describe('Controller', () => {
    describe('ping', () => {
      it('should return "OK"', async () => {
        expect(await healthController.ping()).toBe('OK');
      });
    });
  });
});
