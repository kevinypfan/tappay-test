import {
  Cardholder,
  CardholderVerify,
  ExtraInfo,
  MerchandiseDetails,
  ResultUrl,
} from '../interfaces/children';

export class PayByPrimeRequestDto {
  prime: string;
  amount: number;
  currency?: string;
  order_number?: string;
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
}
