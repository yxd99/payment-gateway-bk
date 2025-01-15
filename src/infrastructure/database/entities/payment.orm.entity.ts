import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Payment } from '@domain/entities/payment.entity';

import { ProductORM } from './product.orm.entity';

@Entity('payments')
export class PaymentORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'transaction_id' })
  transactionId: string;

  @Column({ type: 'decimal', name: 'amount' })
  amount: number;

  @Column({ type: 'text', name: 'reference' })
  reference: string;

  @ManyToOne(() => ProductORM)
  @JoinColumn({ name: 'product_id' })
  product: ProductORM;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  toPayment(payment: PaymentORM): Payment {
    return new Payment({
      id: payment.id,
      product: payment.product,
      amount: payment.amount,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      reference: payment.reference,
    });
  }

  toDBPayment(payment: Payment): PaymentORM {
    const paymentORM = new PaymentORM();
    paymentORM.transactionId = payment.transactionId;
    paymentORM.amount = payment.amount;
    paymentORM.reference = payment.reference;

    const productORM = new ProductORM();
    productORM.id = payment.product.id;
    productORM.name = payment.product.name;
    productORM.price = payment.product.price;
    productORM.imageUrl = payment.product.imageUrl;
    productORM.stock = payment.product.stock;
    productORM.createdAt = payment.product.createdAt;
    productORM.updatedAt = payment.product.updatedAt;
    paymentORM.product = productORM;

    return paymentORM;
  }
}
