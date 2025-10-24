import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';

const paymentArray = [
  {
    id: '1',
    paymentDate: new Date('2023-01-15'),
    amountPaid: 1000,
    comment: 'Pago mensual',
    creditId: 'credit-1',
  },
  {
    id: '2',
    paymentDate: new Date('2023-02-15'),
    amountPaid: 1050,
    comment: 'Pago con abono extra',
    creditId: 'credit-1',
  },
];

const onePayment = {
  id: '1',
  paymentDate: new Date('2023-01-15'),
  amountPaid: 1000,
  comment: 'Pago mensual',
  creditId: 'credit-1',
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let repository: Repository<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            find: jest.fn().mockResolvedValue(paymentArray),
            findOneBy: jest.fn().mockResolvedValue(onePayment),
            save: jest.fn().mockResolvedValue(onePayment),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    repository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a payment', async () => {
      const createPaymentDto = {
        paymentDate: new Date('2023-01-15'),
        amountPaid: 1000,
        comment: 'Pago mensual',
        creditId: 'credit-1',
      };

      await expect(service.create(createPaymentDto)).resolves.toEqual(
        onePayment,
      );
    });
  });

  describe('findAll()', () => {
    it('should return an array of payments', async () => {
      const payments = await service.findAll();
      expect(payments).toEqual(paymentArray);
    });
  });

  describe('findOne()', () => {
    it('should get a single payment', async () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      await expect(service.findOne('1')).resolves.toEqual(onePayment);
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
