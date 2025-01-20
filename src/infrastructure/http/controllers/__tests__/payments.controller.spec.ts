import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';

import { Result } from '@app/common/result';
import { PaymentsService } from '@app/services/payments.service';
import { Payment } from '@domain/entities/payment.entity';
import { Product } from '@domain/entities/product.entity';
import { PaymentsController } from '@infrastructure/http/controllers/payments.controller';
import { DeliveryInfoDto } from '@infrastructure/http/dto/delivery-info.dto';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';
import { CreatePaymentDto } from '@infrastructure/http/dto/payment.dto';

const mockservice = {
  getAcceptanceToken: jest.fn(),
  getPaymentById: jest.fn(),
  createPayment: jest.fn(),
  getMyPayments: jest.fn(),
};

describe('controller', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockservice }],
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
        department: 'Atlantico',
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
        department: 'Atlantico',
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
          department: 'Atlantico',
        },
      });

      expect(result.getValue()).toEqual(payment);
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
          department: 'Cundinamarca',
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
        department: 'Atlantico',
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
        .spyOn(service, 'createPayment')
        .mockResolvedValue(Result.ok(mockPaymemt));

      const result = await controller.createPayment(mockDto);

      expect(result.getValue()).toEqual(mockPaymemt);
      expect(service.createPayment).toHaveBeenCalledWith({
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
          department: mockDto.deliveryInfo.department,
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
          department: 'Cundinamarca',
        },
      };

      jest
        .spyOn(service, 'createPayment')
        .mockRejectedValue(new BadRequestException('Invalid data'));

      await expect(controller.createPayment(mockDto)).rejects.toThrow(
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
          department: 'Cundinamarca',
        },
      };

      const dto = plainToClass(CreatePaymentDto, mockInput);

      expect(dto.deliveryInfo).toBeInstanceOf(DeliveryInfoDto);

      expect(dto.deliveryInfo.address).toBe('123 Main St');
      expect(dto.deliveryInfo.city).toBe('Bogotá');
      expect(dto.deliveryInfo.phone).toBe('+573001234567');
      expect(dto.deliveryInfo.department).toBe('Cundinamarca');
    });
  });

  describe('getMyPayments', () => {
    it('should return a successful result with payments', async () => {
      const email = 'test@example.com';
      const pagination: PaginationDto = { page: 1, size: 10 };
      const mockPayments: Payment[] = [
        {
          id: '1',
          amount: 100,
          customerEmail: email,
          status: 'PENDING',
          transactionId: '1',
          createdAt: new Date(),
          reference: 'reference',
          product: {
            id: '1',
            name: 'product name',
            price: 100,
            imageUrl: 'https://image.com',
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '3154100000',
          department: 'Atlantico',
          productQuantity: 1,
        },
      ];

      jest
        .spyOn(service, 'getMyPayments')
        .mockResolvedValue(Result.ok(mockPayments));

      const result = await controller.getMyPayments(
        {
          email,
        },
        pagination,
      );

      expect(service.getMyPayments).toHaveBeenCalledWith(email, pagination);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(mockPayments);
    });

    it('should return a failed result if service throws an error', async () => {
      const email = 'test@example.com';
      const pagination: PaginationDto = { page: 1, size: 10 };

      jest
        .spyOn(service, 'getMyPayments')
        .mockResolvedValue(Result.fail('Error al obtener pagos'));

      const result = await controller.getMyPayments({ email }, pagination);

      expect(service.getMyPayments).toHaveBeenCalledWith(email, pagination);
      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toBe('Error al obtener pagos');
    });

    it('should return an empty array if no payments are found', async () => {
      const email = 'test@example.com';
      const pagination: PaginationDto = { page: 1, size: 10 };
      const mockPayments: Payment[] = [];

      jest
        .spyOn(service, 'getMyPayments')
        .mockResolvedValue(Result.ok(mockPayments));

      const result = await controller.getMyPayments({ email }, pagination);

      expect(service.getMyPayments).toHaveBeenCalledWith(email, pagination);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(mockPayments);
    });
  });
});
