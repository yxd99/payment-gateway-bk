import { Test, TestingModule } from '@nestjs/testing';

import { Result } from '@app/common/result';
import { PaymentsService } from '@app/services/payments.service';
import { Payment } from '@domain/entities/payment.entity';
import { Product } from '@domain/entities/product.entity';
import { PaymentsController } from '@infrastructure/http/controllers/payments.controller';

const mockPaymentsService = {
  getAcceptanceToken: jest.fn(),
  getPaymentById: jest.fn(),
  createPayment: jest.fn(),
};

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockPaymentsService }],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAcceptanceToken', () => {
    it('should return the acceptance token', async () => {
      service.getAcceptanceToken = jest.fn().mockResolvedValue({
        acceptanceToken: '123',
        personalAuthToken: '456',
      });

      const result = await controller.getAcceptanceToken();

      expect(result).toEqual({
        acceptanceToken: '123',
        personalAuthToken: '456',
      });
      expect(service.getAcceptanceToken).toHaveBeenCalled();
    });
  });

  describe('getPaymentById', () => {
    it('should return a payment', async () => {
      const payment = new Payment({
        id: '123',
        amount: 100,
        customerEmail: 'customer@email.com',
        reference: 'reference',
        createdAt: new Date(),
        product: new Product(
          '1',
          'Test',
          1000,
          'image',
          100,
          new Date(),
          new Date(),
        ),
        transactionId: 'transactionId',
      });
      const response = {
        ...payment,
        status: 'pending',
        statusMessage: 'message',
      };

      jest
        .spyOn(service, 'getPaymentById')
        .mockResolvedValue(Result.ok(response));

      const result = await controller.getPaymentById('123');

      expect(result.getValue()).toEqual(response);
    });

    it('should throw an error if payment is not found', async () => {
      service.getPaymentById = jest
        .fn()
        .mockResolvedValue(Result.fail('Payment not found'));

      await expect(controller.getPaymentById('123')).rejects.toThrow(
        'Payment not found',
      );
    });
  });

  describe('createPayment', () => {
    it('should return a payment', async () => {
      const payment = new Payment({
        id: '123',
        amount: 100,
        customerEmail: 'customer@email.com',
        reference: 'reference',
        createdAt: new Date(),
        product: new Product(
          '1',
          'Test',
          1000,
          'image',
          100,
          new Date(),
          new Date(),
        ),
        transactionId: 'transactionId',
      });
      jest
        .spyOn(service, 'createPayment')
        .mockResolvedValue(Result.ok(payment));

      const result = await controller.createPayment({
        cardHolder: 'cardHolder',
        cvc: '123',
        expirationDate: '12/12',
        cardNumber: '123',
        email: 'customer@email.com',
        installments: 1,
        productId: 'productId',
        acceptanceToken: 'acceptanceToken',
        acceptPersonalAuth: '',
      });

      expect(result.getValue()).toEqual(payment);
    });
  });
});
