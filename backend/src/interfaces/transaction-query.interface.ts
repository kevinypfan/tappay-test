export interface TransactionQuery {
  msg: string;
  records_per_page: number;
  total_page_count: number;
  number_of_transactions: number;
  page: number;
  trade_records: TradeRecord[];
  status: number;
}

export interface TradeRecord {
  rec_trade_id: string;
  record_status: number;
  order_number: string;
  merchant_id: string;
  is_rba_verified: boolean;
  cap_millis: number;
  original_amount: number;
  details: string;
  currency: string;
  partial_card_number: string;
  card_info: CardInfo;
  three_domain_secure: boolean;
  payment_method: string;
  bank_transaction_start_millis: number;
  bank_result_code: string;
  bank_result_msg: string;
  amount: number;
  bank_transaction_id: string;
  pay_by_instalment: boolean;
  merchant_name: string;
  is_captured: boolean;
  transaction_method_details: TransactionMethodDetails;
  bank_transaction_end_millis: number;
  cardholder: Cardholder;
  auth_code: string;
  refunded_amount: number;
  app_name: string;
  kyc_info: KycInfo;
  time: number;
  pay_by_redeem: boolean;
  card_identifier: string;
}

export interface CardInfo {
  issuer_zh_tw: string;
  country: string;
  country_code: string;
  funding: number;
  last_four: string;
  level: string;
  bank_id: string;
  bin_code: string;
  type: number;
  issuer: string;
}

export interface TransactionMethodDetails {
  transaction_method_reference: string;
  transaction_method: string;
}

export interface Cardholder {
  national_id: string;
  member_id: string;
  address: string;
  bank_member_id: string;
  name: string;
  phone_number: string;
  email: string;
  zip_code: string;
}

export interface KycInfo {
  is_kyc_verified: boolean;
  kyc_verification_merchant_id: string;
}
