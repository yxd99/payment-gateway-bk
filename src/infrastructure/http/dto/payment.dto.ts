import { ApiProperty } from '@nestjs/swagger';
import {
  IsCreditCard,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsCreditCard()
  cardNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cvc: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'invalid format date, must be MM/YY',
  })
  expirationDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cardHolder: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNumber()
  installments: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  acceptanceToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  acceptPersonalAuth: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  productQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  deliveryInfo: {
    address: string;
    city: string;
    phone: string;
    state: string;
  };
}
