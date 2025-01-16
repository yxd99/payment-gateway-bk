import {
  IsCreditCard,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsCreditCard()
  cardNumber: string;

  @IsNotEmpty()
  cvc: string;

  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'invalid format date, must be MM/YY',
  })
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
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  acceptanceToken: string;

  @IsNotEmpty()
  @IsString()
  acceptPersonalAuth: string;
}
