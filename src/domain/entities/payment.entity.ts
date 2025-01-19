import { Product } from './product.entity';

interface PaymentProps {
  id?: string;
  product: Product;
  amount: number;
  transactionId: string;
  createdAt: Date;
  reference: string;
  customerEmail: string;
  status: string;
  address: string;
  city: string;
  phone: string;
  state: string;
  productQuantity: number;
}

export class Payment {
  public readonly id?: string;

  public product: Product;

  public reference: string;

  public amount: number;

  public transactionId: string;

  public readonly createdAt: Date;

  public customerEmail: string;

  public status: string;

  public address: string;

  public city: string;

  public phone: string;

  public state: string;

  public productQuantity: number;

  constructor({
    id,
    product,
    amount,
    transactionId,
    createdAt,
    reference,
    customerEmail,
    status,
    address,
    city,
    phone,
    state,
    productQuantity,
  }: PaymentProps) {
    this.id = id;
    this.product = product;
    this.reference = reference;
    this.amount = amount;
    this.transactionId = transactionId;
    this.createdAt = createdAt;
    this.customerEmail = customerEmail;
    this.status = status;
    this.address = address;
    this.city = city;
    this.phone = phone;
    this.state = state;
    this.productQuantity = productQuantity;
  }
}
