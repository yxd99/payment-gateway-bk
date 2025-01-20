import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetPaymentsDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
