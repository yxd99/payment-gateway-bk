import { CreateTransactionDto } from '@app/ports/inbound/create-transaction.dto';
import { TokenizeCardDto } from '@app/ports/inbound/tokenize-card.dto';

export interface PaymentApiRepository {
  tokenizeCard(payload: TokenizeCardDto): Promise<string>;

  createTransaction(payload: CreateTransactionDto): Promise<unknown>;
}
