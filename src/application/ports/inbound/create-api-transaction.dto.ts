export interface CreateApiTransactionDto {
  amount: number;
  token: string;
  installments: number;
  reference: string;
  customerEmail: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
}
