import { randomUUID } from 'crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { Result } from '@app/common/result';
import { CreateTransactionDto } from '@app/ports/inbound/create-transaction.dto';
import { ApiPaymentAcceptancesTokenResponse } from '@app/ports/outbound/api-payment-response.repository';
import { PaymentApiRepository } from '@app/ports/outbound/api-payment.repository';
import { PaymentRepository } from '@app/ports/outbound/payments.repository';
import { ProductRepository } from '@app/ports/outbound/product.repository';
import { Payment } from '@domain/entities/payment.entity';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';
import { sleep } from '@infrastructure/utils/sleep.util';

@Injectable()
export class PaymentsService {
  logger = new Logger(PaymentsService.name);

  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('PaymentApiRepository')
    private readonly paymentApiRepository: PaymentApiRepository,
  ) {}

  async createPayment(payload: CreateTransactionDto): Promise<Result<Payment>> {
    try {
      const product = await this.productRepository.findOne(payload.productId);
      if (!product) {
        return Result.fail('Product not found');
      }
      const [expMonth, expYear] = payload.cardDetails.expirationDate.split('/');
      const reference = randomUUID();
      const amount = product.price * payload.productQuantity;

      const tokenCard = await this.paymentApiRepository.tokenizeCard({
        expMonth,
        expYear,
        cardHolder: payload.cardDetails.cardHolder,
        cvc: payload.cardDetails.cvc,
        cardNumber: payload.cardDetails.cardNumber,
      });
      const transaction = await this.paymentApiRepository.createTransaction({
        reference,
        amount,
        token: tokenCard,
        installments: payload.installments,
        customerEmail: payload.email,
        acceptanceToken: payload.acceptanceToken,
        acceptPersonalAuth: payload.acceptPersonalAuth,
      });
      await sleep(2);
      const {
        data: { status },
      } = await this.paymentApiRepository.getTransaction(transaction.data.id);
      const payment = new Payment({
        product,
        reference,
        amount,
        status,
        transactionId: transaction.data.id,
        createdAt: new Date(),
        customerEmail: payload.email,
        city: payload.deliveryInfo.city,
        address: payload.deliveryInfo.address,
        phone: payload.deliveryInfo.phone,
        department: payload.deliveryInfo.department,
        productQuantity: payload.productQuantity,
      });

      const paymentSave = await this.paymentRepository.create(payment);
      return Result.ok(paymentSave);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async getAcceptanceToken(): Promise<
    Result<ApiPaymentAcceptancesTokenResponse>
  > {
    try {
      const token = await this.paymentApiRepository.getAcceptanceToken();
      return Result.ok(token);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async getPaymentById(
    id: string,
  ): Promise<Result<Payment & { status: string; statusMessage: string }>> {
    try {
      const payment = await this.paymentRepository.findOne(id);
      if (!payment) {
        return Result.fail('Payment not found');
      }
      const transaction = await this.paymentApiRepository.getTransaction(
        payment.transactionId,
      );
      const { status, status_message: statusMessage } = transaction.data;
      return Result.ok({
        ...payment,
        status,
        statusMessage,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }

  async getMyPayments(
    email: string,
    pagination: PaginationDto,
  ): Promise<Result<Payment[]>> {
    try {
      const payments = await this.paymentRepository.findByCustomerEmail(
        email,
        pagination,
      );
      return Result.ok(payments);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
