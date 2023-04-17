export interface ResultUrl {
  frontend_redirect_url?: string;
  backend_notify_url?: string;
  go_back_url?: string;
}

export interface CardholderVerify {
  phone_number: boolean;
  national_id?: boolean;
}

export interface ExtraInfo {
  shopper_info?: object;
}

export interface Cardholder {
  phone_number: string;
  name: string;
  email: string;
  zip_code?: string;
  address?: string;
  national_id?: string;
  member_id?: string;
}

export interface MerchandiseDetails {
  no_rebate_amount?: number;
  no_bonus_amount?: number;
}

export interface JokPayInsurancePolicy {
  proposer?: string;
  insured?: string[];
  insurance_type?: string;
  policy_id?: string;
  payment_deadline?: number;
  payment_frequency?: number;
  final_price?: number;
}
