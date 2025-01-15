import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentRepository } from '@app/ports/outbound/payments.repository';
import { Payment } from '@domain/entities/payment.entity';
import { PaymentORM } from '@infrastructure/database/entities/payment.orm.entity';

@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentORM)
    private readonly paymentRepository: Repository<PaymentORM>,
  ) {}

  create(payment: Payment): Promise<Payment> {
    const paymentORM = new PaymentORM();
    paymentORM.id = payment.id;
    paymentORM.amount = payment.amount;
    paymentORM.reference = payment.reference;
    paymentORM.transactionId = payment.transactionId;
    throw new Error(`Method not implemented. ${payment}`);
  }

  async findOne(id: string): Promise<Payment | null> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (payment) {
      return payment.toPayment(payment);
    }
    return null;
  }
}
