import { Test, TestingModule } from '@nestjs/testing';
import { CreateCreditDto } from './dto/create-credit.dto';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';

describe('CreditsController', () => {
  let creditsController: CreditsController;
  let creditsService: CreditsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CreditsController],
      providers: [
        CreditsService,
        {
          provide: CreditsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((credit: CreateCreditDto) =>
                Promise.resolve({ id: '1', ...credit }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                description: 'Credit #1',
                totalLoan: 10000,
                annualInterestRate: 5.5,
                lifeInsurance: 200,
                expirationDate: new Date('2023-01-01'),
              },
              {
                description: 'Credit #2',
                totalLoan: 20000,
                annualInterestRate: 6.0,
                lifeInsurance: 400,
                expirationDate: new Date('2023-02-01'),
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                description: 'Credit #1',
                totalLoan: 10000,
                annualInterestRate: 5.5,
                lifeInsurance: 200,
                expirationDate: new Date('2023-01-01'),
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    creditsController = app.get<CreditsController>(CreditsController);
    creditsService = app.get<CreditsService>(CreditsService);
  });

  it('should be defined', () => {
    expect(creditsController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all credits ', async () => {
      await creditsController.findAll();
      expect(creditsService.findAll()).toHaveBeenCalled();
    });
  });
});
