import { Body, Controller, Get, Post, Query, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { PayByPrimeRequestDto } from './models/pay-by-prime-request.dto';
import { CheckoutRequestDto } from './models/checkout-request.dto';
import { FrontendCallbackDto } from './models/frontend-callback.dto';
import { NotifyCallbackDto } from './models/notify-callback.dto';
import { PaymentRequestDto } from './models/payment-request.dto';

@Controller({ version: '1.0', path: '/api' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/checkout')
  checkout(@Body() dto: CheckoutRequestDto) {
    return this.appService.checkout(dto);
  }

  @Post('/payment')
  payment(@Body() dto: PaymentRequestDto) {
    return this.appService.payment(dto);
  }

  @Get('/frontend/callback')
  frontendCallback(@Response() res, @Query() dto: FrontendCallbackDto) {
    return this.appService.tappayFrontendCallback(dto, res);
  }

  @Post('/notify/callback')
  notifyCallback(@Query() dto: NotifyCallbackDto) {
    return this.appService.tappayNotifyCallback(dto);
  }
}
