import { Body, Controller, Get, Post } from '@nestjs/common';

import { PaymentService } from '@app/services/payment.service';
import { CreatePaymentDto } from '@infrastructure/http/dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentService) {}

  @Get('acceptance-token')
  async getAcceptanceToken() {
    return this.paymentsService.getAcceptanceToken();
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
