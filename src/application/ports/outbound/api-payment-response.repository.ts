export interface ApiPaymentResponse {
  status: string;
  data: {
    id: string;
    created_at: Date;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    expires_at: Date;
  };
}
