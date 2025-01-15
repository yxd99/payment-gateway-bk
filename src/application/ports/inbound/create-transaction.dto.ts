export interface CreateTransactionDto {
  amount: number;
  token: string;
  installments: number;
  reference: string;
}
