import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { PaymentsService } from '@app/services/payments.service';
import { CreatePaymentDto } from '@infrastructure/http/dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('acceptance-token')
  async getAcceptanceToken() {
    return this.paymentsService.getAcceptanceToken();
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    const result = await this.paymentsService.getPaymentById(id);
    if (!result.isSuccess) {
      throw new NotFoundException('Payment not found');
    }

    return result;
  }

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment({
      cardDetails: {
        cardHolder: createPaymentDto.cardHolder,
        cvc: createPaymentDto.cvc,
        expirationDate: createPaymentDto.expirationDate,
        cardNumber: createPaymentDto.cardNumber,
      },
      email: createPaymentDto.email,
      installments: createPaymentDto.installments,
      productId: createPaymentDto.productId,
      acceptanceToken: createPaymentDto.acceptanceToken,
      acceptPersonalAuth: createPaymentDto.acceptPersonalAuth,
    });
  }
}
