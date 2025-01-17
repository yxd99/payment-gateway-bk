export interface CreateTransactionDto {
  acceptanceToken: string;
  acceptPersonalAuth: string;
  productId: string;
  installments: number;
  email: string;
  cardDetails: {
    cardHolder: string;
    cvc: string;
    expirationDate: string;
    cardNumber: string;
  };
}
