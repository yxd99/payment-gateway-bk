import { Inject, Injectable } from '@nestjs/common';

import { Result } from '@app/common/result';
import { PaymentApiRepository } from '@app/ports/outbound/api-payment.repository';
import { PaymentRepository } from '@app/ports/outbound/payments.repository';
import { ProductRepository } from '@app/ports/outbound/product.repository';
import { Payment } from '@domain/entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('PaymentApiRepository')
    private readonly paymentApiRepository: PaymentApiRepository,
  ) {}

  async createPayment(payload: Payment): Promise<Result<Payment>> {
    try {
      const product = await this.productRepository.findOne(payload.product.id);
      if (!product) {
        return Result.fail('Product not found');
      }
      return Result.ok(await this.paymentRepository.create(payload));
    } catch {
      return Result.fail('Error fetching product');
    }
  }
}
