import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { OrderItem } from 'src/interfaces/order-item.interface';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: String })
  userId: string;

  @Prop(
    raw([
      {
        _id: false,
        productName: { type: String },
        qty: { type: Number },
        price: { type: Number },
      },
    ]),
  )
  snapshot: OrderItem[];

  @Prop({ type: Number, required: true })
  amount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
