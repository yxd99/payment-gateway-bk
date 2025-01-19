import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsCreditCard,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

import { DeliveryInfoDto } from './delivery-info.dto';

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
  @Type(() => DeliveryInfoDto)
  deliveryInfo: DeliveryInfoDto;
}
