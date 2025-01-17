import { CreateApiTransactionDto } from '@app/ports/inbound/create-api-transaction.dto';
import { TokenizeCardDto } from '@app/ports/inbound/tokenize-card.dto';

import {
  ApiPaymentAcceptancesTokenResponse,
  ApiPaymentTransactionResponse,
} from './api-payment-response.repository';

export interface PaymentApiRepository {
  tokenizeCard(payload: TokenizeCardDto): Promise<string>;

  createTransaction(
    payload: CreateApiTransactionDto,
  ): Promise<ApiPaymentTransactionResponse>;

  getAcceptanceToken(): Promise<ApiPaymentAcceptancesTokenResponse>;

  getTransaction(id: string): Promise<ApiPaymentTransactionResponse>;
}
