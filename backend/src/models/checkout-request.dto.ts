import { OrderItem } from 'src/interfaces/order-item.interface';

export class CheckoutRequestDto {
  orderItems: OrderItem[];
}
