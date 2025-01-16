import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  cardNumber: string;

  @IsNotEmpty()
  @IsNumber()
  cvc: string;

  @IsNotEmpty()
  @IsString()
  expirationDate: string;

  @IsNotEmpty()
  @IsString()
  cardHolder: string;

  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNumber()
  installments: number;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  acceptanceToken: string;

  @IsNotEmpty()
  @IsString()
  acceptPersonalAuth: string;
}
