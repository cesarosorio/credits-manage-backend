import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        PaymentsService,
        {
          provide: PaymentsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((payment: CreatePaymentDto) =>
                Promise.resolve({ id: '1', ...payment }),
              ),
            findAll: jest.fn().mockResolvedValue([
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
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                paymentDate: new Date('2023-01-15'),
                amountPaid: 1000,
                comment: 'Pago mensual',
                creditId: 'credit-1',
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentsController = app.get<PaymentsController>(PaymentsController);
    paymentsService = app.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(paymentsController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all payments ', async () => {
      await paymentsController.findAll();
      expect(paymentsService.findAll()).toHaveBeenCalled();
    });
  });
});
