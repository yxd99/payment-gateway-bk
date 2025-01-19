import { Payment } from '@domain/entities/payment.entity';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findOne(id: string): Promise<Payment | null>;
  findByCustomerEmail(
    email: string,
    pagination: PaginationDto,
  ): Promise<Payment[]>;
}
