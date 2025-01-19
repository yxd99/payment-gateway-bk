import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';

import { Result } from '@app/common/result';
import { PaymentsService } from '@app/services/payments.service';
import { Payment } from '@domain/entities/payment.entity';
import { Product } from '@domain/entities/product.entity';
import { PaymentsController } from '@infrastructure/http/controllers/payments.controller';
import { DeliveryInfoDto } from '@infrastructure/http/dto/delivery-info.dto';
import { CreatePaymentDto } from '@infrastructure/http/dto/payment.dto';

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
        status: 'pending',
        address: 'cra 1 cll 1 ',
        city: 'SantaMarta',
        phone: '3154100000',
        state: 'Atlantico',
        productQuantity: 1,
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
        status: 'pending',
        address: 'cra 1 cll 1 ',
        city: 'SantaMarta',
        phone: '3154100000',
        state: 'Atlantico',
        productQuantity: 1,
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
        productQuantity: 1,
        deliveryInfo: {
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '3154100000',
          state: 'Atlantico',
        },
      });

      expect(result.getValue()).toEqual(payment);
    });
  });
});

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockPaymentsService }],
    }).compile();

    paymentsController = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('should create a payment successfully with valid data', async () => {
    const mockDto: CreatePaymentDto = {
      cardNumber: '4111111111111111',
      cvc: '123',
      expirationDate: '12/25',
      cardHolder: 'John Doe',
      productId: '550e8400-e29b-41d4-a716-446655440000',
      installments: 3,
      email: 'test@example.com',
      acceptanceToken: 'some-token',
      acceptPersonalAuth: 'yes',
      productQuantity: 2,
      deliveryInfo: {
        address: '123 Main St',
        city: 'Bogotá',
        phone: '+573001234567',
        state: 'Cundinamarca',
      },
    };

    const mockPaymemt = new Payment({
      id: '7df9777f-a632-4eb9-86ee-8d1ef9f129a8',
      amount: 36554,
      reference: 'a89126f3-248c-4682-908e-096d0620ec06',
      transactionId: '15102-1731998388-86417',
      customerEmail: 'rene.higuita@gmail.com',
      status: 'PENDING',
      address: 'cra 1 cll 1 ',
      city: 'SantaMarta',
      phone: '3154120000',
      state: 'Atlantico',
      productQuantity: 1,
      product: new Product(
        'dc4ac251-b668-4a78-95d4-558e84deb064',
        'Rustic Plastic Pants',
        36554,
        'https://placeholder.pics/svg/600x900/000000/B3B3B3-000000/image-url',
        29,
        new Date(),
        new Date(),
      ),
      createdAt: new Date(),
    });

    jest
      .spyOn(paymentsService, 'createPayment')
      .mockResolvedValue(Result.ok(mockPaymemt));

    const result = await paymentsController.createPayment(mockDto);

    expect(result.getValue()).toEqual(mockPaymemt);
    expect(paymentsService.createPayment).toHaveBeenCalledWith({
      cardDetails: {
        cardHolder: mockDto.cardHolder,
        cvc: mockDto.cvc,
        expirationDate: mockDto.expirationDate,
        cardNumber: mockDto.cardNumber,
      },
      email: mockDto.email,
      installments: mockDto.installments,
      productId: mockDto.productId,
      acceptanceToken: mockDto.acceptanceToken,
      acceptPersonalAuth: mockDto.acceptPersonalAuth,
      productQuantity: mockDto.productQuantity,
      deliveryInfo: {
        address: mockDto.deliveryInfo.address,
        city: mockDto.deliveryInfo.city,
        phone: mockDto.deliveryInfo.phone,
        state: mockDto.deliveryInfo.state,
      },
    });
  });

  it('should throw a BadRequestException if service fails', async () => {
    const mockDto: CreatePaymentDto = {
      cardNumber: '4111111111111111',
      cvc: '123',
      expirationDate: '12/25',
      cardHolder: 'John Doe',
      productId: '550e8400-e29b-41d4-a716-446655440000',
      installments: 3,
      email: 'test@example.com',
      acceptanceToken: 'some-token',
      acceptPersonalAuth: 'yes',
      productQuantity: 2,
      deliveryInfo: {
        address: '123 Main St',
        city: 'Bogotá',
        phone: '+573001234567',
        state: 'Cundinamarca',
      },
    };

    jest
      .spyOn(paymentsService, 'createPayment')
      .mockRejectedValue(new BadRequestException('Invalid data'));

    await expect(paymentsController.createPayment(mockDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should transform deliveryInfo into an instance of DeliveryInfoDto', async () => {
    const mockInput = {
      cardNumber: '4111111111111111',
      cvc: '123',
      expirationDate: '12/25',
      cardHolder: 'John Doe',
      productId: '550e8400-e29b-41d4-a716-446655440000',
      installments: 3,
      email: 'test@example.com',
      acceptanceToken: 'some-token',
      acceptPersonalAuth: 'yes',
      productQuantity: 2,
      deliveryInfo: {
        address: '123 Main St',
        city: 'Bogotá',
        phone: '+573001234567',
        state: 'Cundinamarca',
      },
    };

    const dto = plainToClass(CreatePaymentDto, mockInput);

    expect(dto.deliveryInfo).toBeInstanceOf(DeliveryInfoDto);

    expect(dto.deliveryInfo.address).toBe('123 Main St');
    expect(dto.deliveryInfo.city).toBe('Bogotá');
    expect(dto.deliveryInfo.phone).toBe('+573001234567');
    expect(dto.deliveryInfo.state).toBe('Cundinamarca');
  });
});
