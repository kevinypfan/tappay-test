import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { CardSecret } from 'src/interfaces/pay-by-prime-response.interface';
import { Order } from './order.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  order: Order;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, required: true })
  status: number;

  @Prop({ type: String })
  msg: string;

  @Prop({ type: String })
  bankTransactionId: string;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: String })
  acquirer: string;

  @Prop({ type: String })
  merchantId: string;

  @Prop({ type: String, unique: true })
  recTradeId: string;

  @Prop({ type: Number })
  transactionTimeMillis: string;

  @Prop(
    raw({
      card_token: { type: String },
      card_key: { type: String },
    }),
  )
  cardSecret: CardSecret;

  @Prop({ type: Boolean, default: false })
  isDone: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
