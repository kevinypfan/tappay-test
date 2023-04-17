import {
  EInvoiceCarrier,
  PayInfo,
} from 'src/interfaces/notify-response.interface';

export class NotifyCallbackDto {
  rec_trade_id: string;
  auth_code: string;
  order_number: string;
  bank_transaction_id: string;
  bank_order_number: string;
  status: number;
  msg: string;
  transaction_time_millis: number;
  pay_info: PayInfo;
  e_invoice_carrier: EInvoiceCarrier;
  acquirer: string;
  card_identifier: string;
  bank_result_code: string;
  bank_result_msg: string;
}
