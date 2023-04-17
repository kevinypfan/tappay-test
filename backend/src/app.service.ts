import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PayByPrimeRequestDto } from './models/pay-by-prime-request.dto';
import { randomUUID } from 'crypto';
import { PayByPrimeRequest } from './interfaces/pay-by-prime-request.interface';
import axios from 'axios';
import { PayByPrimeResponse } from './interfaces/pay-by-prime-response.interface';
import { CheckoutRequestDto } from './models/checkout-request.dto';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentRequestDto } from './models/payment-request.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { REDIS_CACHE_CLIENT } from './constants/app.constant';
import Redis from 'ioredis';
import { PaymentResponseDto } from './models/payment-response.dto';
import { Transaction } from './schemas/transaction.schema';
import { Cargo } from './models/cargo.model';
import { FrontendCallbackDto } from './models/frontend-callback.dto';
import { TransactionQuery } from './interfaces/transaction-query.interface';
import { Request, Response } from 'express';
import { NotifyCallbackDto } from './models/notify-callback.dto';

@Injectable()
export class AppService {
  private payByPrimePath = '/tpc/payment/pay-by-prime';

  private payByTokenPath = '/tpc/payment/pay-by-token';

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>, // @InjectRedis(REDIS_CACHE_CLIENT) private readonly redis: Redis,
  ) {}

  async checkout(dto: CheckoutRequestDto): Promise<Cargo<Order>> {
    const order = new this.orderModel();
    order.snapshot = dto.orderItems;
    order.amount = dto.orderItems
      .map((item) => item.price * item.qty)
      .reduce((a, b) => a + b, 0);

    return new Cargo(await order.save());
  }

  async payment(dto: PaymentRequestDto): Promise<Cargo> {
    const order = await this.orderModel.findById(dto.orderId);
    if (!order) throw new NotFoundException();

    const existTx = await this.transactionModel.findOne({
      isDone: true,
      order,
    });

    if (existTx)
      throw new BadRequestException('This order has already been paid for.');

    if (order.amount !== dto.amount)
      throw new BadRequestException(
        'The amount entered does not match the order amount.',
      );

    const paymentPayload: PayByPrimeRequest = {
      prime: dto.prime,
      partner_key: process.env.TAP_PAY_PARTNER_KEY,
      merchant_id: process.env.TAP_PAY_MERCHANT_ID,
      amount: dto.amount,
      details: `TWD$ ${dto.amount}`,
      order_number: order._id.toString(),
      cardholder: dto.cardholder,
      three_domain_secure: !!dto.threeDomainSecure, // 3D 驗證
      result_url: {
        backend_notify_url: process.env.PAYMENT_URL + '/notify/callback',
        frontend_redirect_url: process.env.PAYMENT_URL + '/frontend/callback',
        go_back_url: process.env.PAYMENT_URL + '/',
      },
      remember: false,
    };

    const transaction = await this.tappayPrimeTransaction(
      paymentPayload,
      order,
    );

    if (transaction.status !== 0)
      throw new InternalServerErrorException(transaction.msg);

    if (!dto.threeDomainSecure)
      await order.updateOne({ $set: { isPaid: true } });

    const resBody = new PaymentResponseDto();

    resBody.amount = transaction.amount;
    resBody.orderId = transaction.order._id;
    resBody.paymentUrl = transaction.paymentUrl;
    resBody.threeDomainSecure = !!dto.threeDomainSecure;

    return new Cargo(resBody);
  }

  async tappayFrontendCallback(dto: FrontendCallbackDto, res: Response) {
    console.log(JSON.stringify(dto, null, 2));

    const url = 'https://sandbox.tappaysdk.com/tpc/transaction/query';

    const headers = {
      'x-api-key': process.env.TAP_PAY_PARTNER_KEY,
    };

    const payload = {
      partner_key: process.env.TAP_PAY_PARTNER_KEY,
      filters: {
        rec_trade_id: dto.rec_trade_id,
      },
    };

    const { data } = await axios.post<TransactionQuery>(url, payload, {
      headers,
    });

    if (data.number_of_transactions !== 1)
      return res.redirect('/transaction/failed');

    await this.transactionModel.findOneAndUpdate(
      {
        recTradeId: data.trade_records[0].rec_trade_id,
      },
      {
        $set: {
          isDone: true,
        },
      },
    );

    return res.redirect('/transaction/success');
  }

  async tappayNotifyCallback(dto: NotifyCallbackDto) {
    console.log(JSON.stringify(dto, null, 2));
    if (dto.status !== 0) return;
    await this.transactionModel.findOneAndUpdate(
      {
        recTradeId: dto.rec_trade_id,
      },
      {
        $set: {
          isDone: true,
        },
      },
    );
  }

  private async tappayPrimeTransaction(
    payload: PayByPrimeRequest,
    order: Order,
  ) {
    const { data } = await axios.post<PayByPrimeResponse>(
      `${process.env.TAP_PAY_TEST_URL}${this.payByPrimePath}`,
      payload,
      {
        headers: {
          'x-api-key': process.env.TAP_PAY_PARTNER_KEY,
        },
      },
    );

    const transaction = new this.transactionModel({
      order,
      amount: data.amount,
      status: data.status,
      msg: data.msg,
      bankTransactionId: data.bank_transaction_id,
      currency: data.currency,
      acquirer: data.acquirer,
      merchantId: data.merchant_id,
      recTradeId: data.rec_trade_id,
      transactionTimeMillis: data.transaction_time_millis,
      cardSecret: data.card_secret,
      isDone: !data.payment_url,
    });

    const savedTransaction = await transaction.save();

    return {
      ...savedTransaction.toObject(),
      paymentUrl: data.payment_url,
    };
  }
}
