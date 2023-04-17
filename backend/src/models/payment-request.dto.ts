import { Cardholder } from 'src/interfaces/children';

export class PaymentRequestDto {
  prime: string;
  cardholder: Cardholder;
  orderId: string;
  amount: number;
  threeDomainSecure?: boolean;
}
