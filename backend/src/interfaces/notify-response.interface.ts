import { MerchandiseDetails } from './children';

export interface PayInfo {
  method: string;
  masked_credit_card_number: string;
  credit_card: number;
  balance: number;
  bank_account: number;
  point: number;
  discount: number;
  bin_code: string;
}

export interface EInvoiceCarrier {
  type: number;
  number: string;
  donation: boolean;
  donation_id: string;
}

export interface NotifyResponse {
  rec_trade_id: string;
  auth_code: string;
  bank_transaction_id: string;
  bank_order_number: string;
  order_number: string;
  amount: number;
  status: number;
  msg: string;
  transaction_time_millis: number;
  pay_info: PayInfo;
  e_invoice_carrier: EInvoiceCarrier;
  acquirer: string;
  card_identifier: string;
  bank_result_code: string;
  bank_result_msg: string;
  merchant_reference_info: string;
  instalment_info: object;
  redeem_info: object;
  event_code: string;
  merchandise_details: MerchandiseDetails;
}
