import { Inject, Injectable, Logger } from '@nestjs/common';

import { Result } from '@app/common/result';
import { ApiPaymentAcceptancesTokenResponse } from '@app/ports/outbound/api-payment-response.repository';
import { PaymentApiRepository } from '@app/ports/outbound/api-payment.repository';
import { PaymentRepository } from '@app/ports/outbound/payments.repository';
import { ProductRepository } from '@app/ports/outbound/product.repository';
import { Payment } from '@domain/entities/payment.entity';

interface CreateTransactionDto {
  acceptanceToken: string;
  acceptPersonalAuth: string;
  productId: string;
  installments: number;
  email: string;
  cardDetails: {
    cardHolder: string;
    cvc: string;
    expirationDate: string;
    cardNumber: string;
  };
}

@Injectable()
export class PaymentService {
  logger = new Logger(PaymentService.name);

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
      const reference = crypto.randomUUID();
      const tokenCard = await this.paymentApiRepository.tokenizeCard({
        expMonth,
        expYear,
        cardHolder: payload.cardDetails.cardHolder,
        cvc: payload.cardDetails.cvc,
        cardNumber: payload.cardDetails.cardNumber,
      });
      const transaction = await this.paymentApiRepository.createTransaction({
        reference,
        amount: product.price,
        token: tokenCard,
        installments: payload.installments,
        customerEmail: payload.email,
        acceptanceToken: payload.acceptanceToken,
        acceptPersonalAuth: payload.acceptPersonalAuth,
      });
      const payment = new Payment({
        product,
        reference,
        amount: product.price,
        transactionId: String(transaction.data.id),
        createdAt: new Date(),
        customerEmail: payload.email,
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
}
