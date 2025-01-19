import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentRepository } from '@app/ports/outbound/payments.repository';
import { Payment } from '@domain/entities/payment.entity';
import { PaymentORM } from '@infrastructure/database/entities/payment.orm.entity';
import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

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
    paymentORM.customerEmail = payment.customerEmail;
    paymentORM.status = payment.status;
    paymentORM.address = payment.address;
    paymentORM.city = payment.city;
    paymentORM.phone = payment.phone;
    paymentORM.state = payment.state;
    paymentORM.productQuantity = payment.productQuantity;
    paymentORM.product = payment.product as ProductORM;

    return this.paymentRepository.save(paymentORM);
  }

  async findOne(id: string): Promise<Payment | null> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (payment) {
      return payment.toPayment(payment);
    }
    return null;
  }

  async findByCustomerEmail(
    email: string,
    pagination: PaginationDto,
  ): Promise<Payment[]> {
    const { page, size } = pagination;
    const payments = await this.paymentRepository.find({
      where: { customerEmail: email },
      skip: page - 1,
      take: size,
    });
    return payments.map((payment) => payment.toPayment(payment));
  }
}
