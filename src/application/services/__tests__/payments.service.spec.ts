import { Test, TestingModule } from '@nestjs/testing';

import { PaymentApiRepository } from '@app/ports/outbound/api-payment.repository';
import { PaymentRepository } from '@app/ports/outbound/payments.repository';
import { ProductRepository } from '@app/ports/outbound/product.repository';
import { PaymentsService } from '@app/services/payments.service';
import { Payment } from '@domain/entities/payment.entity';
import { Product } from '@domain/entities/product.entity';

const mockProductRepository = {
  findOne: jest.fn(),
  findAll: jest.fn(),
};

const mockPaymentRepository = {
  create: jest.fn(),
};

const mockPaymentApiRepository = {
  tokenizeCard: jest.fn(),
  createTransaction: jest.fn(),
  getAcceptanceToken: jest.fn(),
  getTransaction: jest.fn(),
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let repository: PaymentRepository;
  let productRepository: ProductRepository;
  let apiRepository: PaymentApiRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: 'PaymentRepository', useValue: mockPaymentRepository },
        { provide: 'ProductRepository', useValue: mockProductRepository },
        { provide: 'PaymentApiRepository', useValue: mockPaymentApiRepository },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    repository = module.get<PaymentRepository>('PaymentRepository');
    productRepository = module.get<ProductRepository>('ProductRepository');
    apiRepository = module.get<PaymentApiRepository>('PaymentApiRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should tokenize a card', async () => {
      const payment = {
        amount: 10000,
        createdAt: '2025-01-17T13:56:26.678Z',
        customerEmail: 'juan@perez.com',
        id: '1',
        productId: '1',
        reference: '123',
        transactionId: '1',
      };
      productRepository.findOne = jest.fn().mockResolvedValue({
        id: '1',
        name: 'product',
        price: 10000,
      });
      apiRepository.tokenizeCard = jest.fn().mockResolvedValue('123');
      apiRepository.createTransaction = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          status: 'success',
          status_message: 'Payment created successfully',
        },
      });
      repository.create = jest.fn().mockResolvedValue(payment);

      const response = await service.createPayment({
        cardDetails: {
          cardHolder: 'Juan Perez',
          cvc: '123',
          expirationDate: '12/25',
          cardNumber: '4222222222222222',
        },
        email: 'juan@perez.com',
        installments: 1,
        productId: '1',
        acceptanceToken: '123',
        acceptPersonalAuth: '123',
        productQuantity: 1,
        deliveryInfo: {
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '3154100000',
          state: 'Atlantico',
        },
      });
      expect(response.isSuccess).toBe(true);
      expect(response.getValue()).toEqual(payment);
    });

    it('should return error if product not found', async () => {
      productRepository.findOne = jest.fn().mockResolvedValue(null);

      const response = await service.createPayment({
        cardDetails: {
          cardHolder: 'Juan Perez',
          cvc: '123',
          expirationDate: '12/25',
          cardNumber: '4222222222222222',
        },
        email: 'juan@perez.com',
        installments: 1,
        productId: '1',
        acceptanceToken: '123',
        acceptPersonalAuth: '123',
        productQuantity: 1,
        deliveryInfo: {
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '3154100000',
          state: 'Atlantico',
        },
      });
      expect(response.isSuccess).toBe(false);
      expect(response.getError()).toEqual('Product not found');
    });

    it('should return error if tokenize card fails', async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({
        id: '1',
        name: 'product',
        price: 10000,
      });
      apiRepository.tokenizeCard = jest.fn().mockRejectedValue('error');

      const response = await service.createPayment({
        cardDetails: {
          cardHolder: 'Juan Perez',
          cvc: '123',
          expirationDate: '12/25',
          cardNumber: '4222222222222222',
        },
        email: 'juan@perez.com',
        installments: 1,
        productId: '1',
        acceptanceToken: '123',
        acceptPersonalAuth: '123',
        productQuantity: 1,
        deliveryInfo: {
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '3154100000',
          state: 'Atlantico',
        },
      });
      expect(response.isSuccess).toBe(false);
      expect(response.getError()).toEqual('error');
    });

    it('should return error if create transaction fails', async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({
        id: '1',
        name: 'product',
        price: 10000,
      });
      apiRepository.tokenizeCard = jest.fn().mockResolvedValue('123');
      apiRepository.createTransaction = jest.fn().mockRejectedValue('error');

      const response = await service.createPayment({
        cardDetails: {
          cardHolder: 'Juan Perez',
          cvc: '123',
          expirationDate: '12/25',
          cardNumber: '4222222222222222',
        },
        email: 'juan@perez.com',
        installments: 1,
        productId: '1',
        acceptanceToken: '123',
        acceptPersonalAuth: '123',
        productQuantity: 1,
        deliveryInfo: {
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '3154100000',
          state: 'Atlantico',
        },
      });
      expect(response.isSuccess).toBe(false);
      expect(response.getError()).toEqual('error');
    });

    it('should return error if create payment fails', async () => {
      productRepository.findOne = jest.fn().mockResolvedValue({
        id: '1',
        name: 'product',
        price: 10000,
      });
      apiRepository.tokenizeCard = jest.fn().mockResolvedValue('123');
      apiRepository.createTransaction = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          status: 'error',
          status_message: 'Payment created successfully',
        },
      });
      repository.create = jest.fn().mockRejectedValue('error');

      const response = await service.createPayment({
        cardDetails: {
          cardHolder: 'Juan Perez',
          cvc: '123',
          expirationDate: '12/25',
          cardNumber: '4222222222222222',
        },
        email: 'juan@perez.com',
        installments: 1,
        productId: '1',
        acceptanceToken: '123',
        acceptPersonalAuth: '123',
        productQuantity: 1,
        deliveryInfo: {
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '3154100000',
          state: 'Atlantico',
        },
      });
      expect(response.isSuccess).toBe(false);
      expect(response.getError()).toEqual('error');
    });
  });

  describe('getAcceptanceToken', () => {
    it('should return a acceptance tokens', async () => {
      const tokens = { acceptanceToken: '', personalAuthToken: '' };
      apiRepository.getAcceptanceToken = jest.fn().mockResolvedValue(tokens);

      const result = await service.getAcceptanceToken();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(tokens);
    });

    it('should return a failure if an error occurs', async () => {
      apiRepository.getAcceptanceToken = jest
        .fn()
        .mockRejectedValue('Error fetching acceptance token');

      const result = await service.getAcceptanceToken();

      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toEqual('Error fetching acceptance token');
    });
  });

  describe('getPaymentById', () => {
    it('should return a payment by ID', async () => {
      const product = new Product(
        '1',
        'Test',
        1000,
        'image',
        100,
        new Date(),
        new Date(),
      );
      const payment = new Payment({
        id: '1',
        amount: 100,
        customerEmail: 'customer@email.com',
        reference: 'reference',
        createdAt: new Date(),
        product,
        transactionId: 'transactionId',
        status: 'pending',
        address: 'cra 1 cll 1 ',
        city: 'SantaMarta',
        phone: '3154100000',
        state: 'Atlantico',
        productQuantity: 1,
      });
      const transaction = {
        data: {
          status: 'success',
          status_message: 'Payment created successfully',
        },
      };
      apiRepository.getTransaction = jest.fn().mockResolvedValue(transaction);
      repository.findOne = jest.fn().mockResolvedValue(payment);

      const result = await service.getPaymentById('1');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual({
        ...payment,
        status: transaction.data.status,
        statusMessage: transaction.data.status_message,
      });

      try {
        result.getError();
      } catch (error) {
        expect(error.message).toEqual('No error in a successful result');
      }
    });

    it('should return a failure if payment is not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.getPaymentById('99');

      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toEqual('Payment not found');
      try {
        result.getValue();
      } catch (error) {
        expect(error.message).toEqual(
          'Cannot get the value from a failed result',
        );
      }
    });

    it('should return a failure if an error occurs', async () => {
      repository.findOne = jest
        .fn()
        .mockRejectedValue('Error fetching payment by ID');

      const result = await service.getPaymentById('99');

      expect(result.getError()).toEqual('Error fetching payment by ID');
    });
  });
});
