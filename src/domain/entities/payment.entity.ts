import { Product } from './product.entity';

interface PaymentProps {
  id?: string;
  product: Product;
  amount: number;
  transactionId: string;
  createdAt: Date;
  reference: string;
  customerEmail: string;
}

export class Payment {
  public readonly id?: string;

  public product: Product;

  public reference: string;

  public amount: number;

  public transactionId: string;

  public readonly createdAt: Date;

  public customerEmail: string;

  constructor({
    id,
    product,
    amount,
    transactionId,
    createdAt,
    reference,
    customerEmail,
  }: PaymentProps) {
    this.id = id;
    this.product = product;
    this.reference = reference;
    this.amount = amount;
    this.transactionId = transactionId;
    this.createdAt = createdAt;
    this.customerEmail = customerEmail;
  }
}
