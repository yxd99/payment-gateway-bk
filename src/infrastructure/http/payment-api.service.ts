import { Injectable, Logger } from '@nestjs/common';

import { CreateApiTransactionDto } from '@app/ports/inbound/create-api-transaction.dto';
import { TokenizeCardDto } from '@app/ports/inbound/tokenize-card.dto';
import {
  ApiPaymentAcceptancesTokenResponse,
  ApiPaymentAcceptanceTokenResponse,
  ApiPaymentTokenizedResponse,
  ApiPaymentTransactionResponse,
} from '@app/ports/outbound/api-payment-response.repository';
import { PaymentApiRepository } from '@app/ports/outbound/api-payment.repository';
import { envs } from '@infrastructure/config/envs';
import { generateSignature } from '@infrastructure/utils/signature.util';

import { HttpClientService } from './http-client.service';

@Injectable()
export class PaymentApiService implements PaymentApiRepository {
  logger = new Logger(PaymentApiService.name);

  constructor(private readonly httpClientService: HttpClientService) {}

  async tokenizeCard(payload: TokenizeCardDto): Promise<string> {
    const ep = `${envs.PAYMENT_API_URL}/tokens/cards`;
    const response =
      await this.httpClientService.post<ApiPaymentTokenizedResponse>(
        ep,
        {
          number: payload.cardNumber,
          cvc: payload.cvc,
          exp_month: payload.expMonth,
          exp_year: payload.expYear,
          card_holder: payload.cardHolder,
        },
        {
          headers: {
            Authorization: `Bearer ${envs.PAYMENT_API_PUBLIC_API_KEY}`,
          },
        },
      );
    if (response.status === 'CREATED' && response.data?.id) {
      return response.data.id;
    }

    throw new Error('Tokenization failed: Invalid response');
  }

  async createTransaction(
    payload: CreateApiTransactionDto,
  ): Promise<ApiPaymentTransactionResponse> {
    try {
      const currency = 'COP';
      const amount = Number(payload.amount * 100);
      const signature = await generateSignature({
        amount,
        currency,
        reference: payload.reference,
      });
      const response =
        await this.httpClientService.post<ApiPaymentTransactionResponse>(
          `${envs.PAYMENT_API_URL}/transactions`,
          {
            signature,
            currency,
            acceptance_token: payload.acceptanceToken,
            accept_personal_auth: payload.acceptPersonalAuth,
            amount_in_cents: amount,
            customer_email: payload.customerEmail,
            reference: payload.reference,
            payment_method_type: 'CARD',
            payment_method: {
              type: 'CARD',
              token: payload.token,
              installments: payload.installments,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${envs.PAYMENT_API_PUBLIC_API_KEY}`,
            },
          },
        );
      if (response.data.status === 'DECLINED') {
        throw new Error(
          `Transaction declined: ${response.data.status_message}`,
        );
      }

      return response;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getAcceptanceToken(): Promise<ApiPaymentAcceptancesTokenResponse> {
    const response =
      await this.httpClientService.get<ApiPaymentAcceptanceTokenResponse>(
        `${envs.PAYMENT_API_URL}/merchants/${envs.PAYMENT_API_PUBLIC_API_KEY}`,
      );
    return {
      acceptanceToken: response.data.presigned_acceptance.acceptance_token,
      personalAuthToken:
        response.data.presigned_personal_data_auth.acceptance_token,
    };
  }

  async getTransaction(id: string): Promise<ApiPaymentTransactionResponse> {
    const response =
      await this.httpClientService.get<ApiPaymentTransactionResponse>(
        `${envs.PAYMENT_API_URL}/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${envs.PAYMENT_API_PUBLIC_API_KEY}`,
          },
        },
      );
    return response;
  }
}
