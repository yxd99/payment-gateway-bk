import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { PaymentsService } from '@app/services/payments.service';
import { badRequestSchema } from '@infrastructure/http/docs/payments/bad-request.schema';
import { createPaymentSchema } from '@infrastructure/http/docs/payments/created.schema';
import { notFoundSchema } from '@infrastructure/http/docs/payments/not-found.schema';
import {
  okGenerateAcceptanceTokenSchema,
  okPaymentByIdSchema,
} from '@infrastructure/http/docs/payments/ok.schema';
import { CreatePaymentDto } from '@infrastructure/http/dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOkResponse(okGenerateAcceptanceTokenSchema)
  @Get('acceptance-token')
  async getAcceptanceToken() {
    return this.paymentsService.getAcceptanceToken();
  }

  @ApiOkResponse(okPaymentByIdSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    const result = await this.paymentsService.getPaymentById(id);
    if (!result.isSuccess) {
      throw new NotFoundException('Payment not found');
    }

    return result;
  }

  @ApiBody({ type: CreatePaymentDto })
  @ApiOkResponse(createPaymentSchema)
  @ApiBadRequestResponse(badRequestSchema)
  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const result = await this.paymentsService.createPayment({
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
      productQuantity: createPaymentDto.productQuantity,
      deliveryInfo: {
        address: createPaymentDto.deliveryInfo.address,
        city: createPaymentDto.deliveryInfo.city,
        phone: createPaymentDto.deliveryInfo.phone,
        state: createPaymentDto.deliveryInfo.state,
      },
    });
    return result;
  }
}
