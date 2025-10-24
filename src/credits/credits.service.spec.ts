import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './credit.entity';
import { CreditsService } from './credits.service';

const creditArray = [
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
];

const oneCredit = {
  description: 'Credit #1',
  totalLoan: 10000,
  annualInterestRate: 5.5,
  lifeInsurance: 200,
  expirationDate: new Date('2023-01-01'),
  termMonths: 12,
  paymentAmount: 900.5, // This should be calculated
};

describe('CreditsService', () => {
  let service: CreditsService;
  let repository: Repository<Credit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditsService,
        {
          provide: getRepositoryToken(Credit),
          useValue: {
            find: jest.fn().mockResolvedValue(creditArray),
            findOneBy: jest.fn().mockResolvedValue(oneCredit),
            save: jest.fn().mockResolvedValue(oneCredit),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreditsService>(CreditsService);
    repository = module.get<Repository<Credit>>(getRepositoryToken(Credit));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a credit', () => {
      return expect(
        service.create({
          description: 'Credit #1',
          totalLoan: 10000,
          annualInterestRate: 5.5,
          lifeInsurance: 200,
          expirationDate: new Date('2023-01-01'),
          termMonths: 12,
        }),
      ).resolves.toEqual(oneCredit);
    });
  });

  describe('findAll()', () => {
    it('should return an array of credits', async () => {
      const credits = await service.findAll();
      expect(credits).toEqual(creditArray);
    });
  });

  describe('findOne()', () => {
    it('should get a single credit', async () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      await expect(service.findOne('1')).resolves.toEqual(oneCredit);
      expect(repoSpy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('remove()', () => {
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(repository, 'delete');
      const retVal = await service.remove('2');
      expect(removeSpy).toHaveBeenCalledWith('2');
      expect(retVal).toBeUndefined();
    });
  });
});
