import { Body, Controller, Get, Post, Query, Response } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get('/transaction/failed')
  transctionFailedPage() {
    return '交易失敗';
  }

  @Get('/transaction/success')
  transctionSuccessPage() {
    return '交易成功';
  }
}
