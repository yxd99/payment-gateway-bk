import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ProductORM } from './product.orm.entity';

@Entity('payments')
export class PaymentORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'transaction_id' })
  transactionId: string;

  @Column({ type: 'decimal', name: 'amount' })
  amount: number;

  @ManyToOne(() => ProductORM)
  @JoinColumn({ name: 'product_id' })
  product: ProductORM;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
