export interface ApiPaymentTokenizedResponse {
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

export interface ApiPaymentTransactionResponse {
  data: {
    id: string;
    created_at: string;
    amount_in_cents: number;
    reference: string;
    currency: string;
    payment_method_type: string;
    payment_method: {
      type: string;
      extra: {
        name: string;
        brand: string;
        last_four: string;
        processor_response_code: string;
      };
      installments: number;
    };
    redirect_url: null;
    status: string;
    status_message: string;
    merchant: {
      name: string;
      legal_name: string;
      contact_name: string;
      phone_number: string;
      logo_url: null;
      legal_id_type: string;
      email: string;
      legal_id: string;
    };
    taxes: [];
  };
}

export interface ApiPaymentAcceptanceTokenResponse {
  data: {
    presigned_acceptance: {
      acceptance_token: string;
      permalink: string;
      type: string;
    };
    presigned_personal_data_auth: {
      acceptance_token: string;
      permalink: string;
      type: string;
    };
  };
}

export interface ApiPaymentAcceptancesTokenResponse {
  acceptanceToken: string;
  personalAuthToken: string;
}
