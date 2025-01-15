import { Injectable } from '@nestjs/common';

import { CreateTransactionDto } from '@app/ports/inbound/create-transaction.dto';
import { TokenizeCardDto } from '@app/ports/inbound/tokenize-card.dto';
import { ApiPaymentResponse } from '@app/ports/outbound/api-payment-response.repository';
import { PaymentApiRepository } from '@app/ports/outbound/api-payment.repository';
import { envs } from '@infrastructure/config/envs';

import { HttpClientService } from './http-client.service';

@Injectable()
export class PaymentApiService implements PaymentApiRepository {
  constructor(private readonly httpClientService: HttpClientService) {}

  async tokenizeCard(payload: TokenizeCardDto): Promise<string> {
    const response = await this.httpClientService.post<ApiPaymentResponse>(
      `${envs.PAYMENT_API_URL_SANDBOX}/v1/tokens/cards`,
      payload,
    );

    if (response.status === 'CREATED' && response.data?.id) {
      return response.data.id;
    }

    throw new Error('Tokenization failed: Invalid response');
  }

  async createTransaction(payload: CreateTransactionDto): Promise<unknown> {
    const response = await this.httpClientService.post<Record<string, unknown>>(
      '/transaction',
      {
        amount_in_cents: payload.amount,
        reference: payload.reference,
        currency: 'COP',
        payment_method: {
          type: 'CARD',
          token: payload.token,
          installments: payload.installments,
        },
      },
    );

    if (response.status === 'DECLINED') {
      throw new Error(`Transaction declined: ${response.status_message}`);
    }

    return response.data;
  }
}
