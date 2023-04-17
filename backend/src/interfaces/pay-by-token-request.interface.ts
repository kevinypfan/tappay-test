import { CardholderVerify, ResultUrl } from './children';

export interface PayByTokenRequest {
  card_key: string;
  card_token: string;
  partner_key: string;
  currency: string;
  merchant_id: string;
  merchant_group_id?: string;
  order_number?: string;
  bank_transaction_id?: string;
  details: string;
  amount: number;
  cardholder_verify?: CardholderVerify;
  kyc_verification_merchant_id?: string;
  instalment?: number;
  delay_capture_in_days?: number;
  three_domain_secure?: boolean;
  result_url?: ResultUrl;
  card_ccv?: string;
  redeem?: boolean;
  additional_data?: string;
  ccv_prime?: string;
  device_id?: string;
}
