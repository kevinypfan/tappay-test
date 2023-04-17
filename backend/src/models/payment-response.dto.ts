import { Cardholder } from 'src/interfaces/children';

export class PaymentResponseDto {
  orderId: string;
  amount: number;
  threeDomainSecure: boolean;
  paymentUrl?: string;
}
