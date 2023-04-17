import {
  Cardholder,
  CardholderVerify,
  ExtraInfo,
  MerchandiseDetails,
  ResultUrl,
} from './children';

export interface PayByPrimeRequest {
  prime: string;
  partner_key: string;
  merchant_id: string;
  merchant_group_id?: string;
  amount: number;
  merchandise_details?: MerchandiseDetails;
  currency?: string;
  order_number?: string;
  bank_transaction_id?: string;
  details: string;
  cardholder: Cardholder;
  cardholder_verify?: CardholderVerify;
  kyc_verification_merchant_id?: string;
  instalment?: number;
  delay_capture_in_days?: number;
  three_domain_secure?: boolean;
  result_url?: ResultUrl;
  remember?: boolean;
  redeem?: boolean;
  additional_data?: string;
  event_code?: string;
  product_image_url?: string;
  jko_pay_insurance_policy?: string[];
  extra_info?: ExtraInfo;
  payment_url?: string;
}
