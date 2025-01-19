import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { PaymentsService } from '@app/services/payments.service';
import {
  badRequestForGetPaymentByCustomerEmailSchema,
  badRequestSchema,
} from '@infrastructure/http/docs/payments/bad-request.schema';
import { createPaymentSchema } from '@infrastructure/http/docs/payments/created.schema';
import { notFoundSchema } from '@infrastructure/http/docs/payments/not-found.schema';
import {
  okGenerateAcceptanceTokenSchema,
  okPaymentByEmailSchema,
  okPaymentByIdSchema,
} from '@infrastructure/http/docs/payments/ok.schema';
import { GetPaymentsDto } from '@infrastructure/http/dto/get-payments.dto';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';
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

  @ApiOkResponse(okPaymentByEmailSchema)
  @ApiBadRequestResponse(badRequestForGetPaymentByCustomerEmailSchema)
  @Get('my-payments/:email')
  async getMyPayments(
    @Param() getPaymentsDto: GetPaymentsDto,
    @Query() pagination: PaginationDto,
  ) {
    const { email } = getPaymentsDto;
    return this.paymentsService.getMyPayments(email, pagination);
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
