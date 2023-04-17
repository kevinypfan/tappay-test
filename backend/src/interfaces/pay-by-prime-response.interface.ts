export interface PayByPrimeResponse {
  status: number;
  msg: string;
  amount: number;
  acquirer: string;
  currency: string;
  card_secret: CardSecret;
  rec_trade_id: string;
  bank_transaction_id: string;
  order_number: string;
  auth_code: string;
  card_info: CardInfo;
  transaction_time_millis: number;
  bank_transaction_time: BankTransactionTime;
  bank_result_code: string;
  bank_result_msg: string;
  payment_url: string;
  card_identifier: string;
  merchant_id: string;
  is_rba_verified: boolean;
  transaction_method_details: TransactionMethodDetails;
}

export interface CardSecret {
  card_token: string;
  card_key: string;
}

export interface CardInfo {
  issuer: string;
  funding: number;
  type: number;
  level: string;
  country: string;
  last_four: string;
  bin_code: string;
  issuer_zh_tw: string;
  bank_id: string;
  country_code: string;
  expiry_date: string;
}

export interface BankTransactionTime {
  start_time_millis: string;
  end_time_millis: string;
}

export interface TransactionMethodDetails {
  transaction_method_reference: string;
  transaction_method: string;
}
