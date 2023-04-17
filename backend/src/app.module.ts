import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { APP_FILTER } from '@nestjs/core';
import { CargoExceptionFilter } from './cargo-exception.filter';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { REDIS_CACHE_CLIENT } from './constants/app.constant';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { ViewController } from './view.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
      ],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    // RedisModule.forRoot({
    //   config: [
    //     {
    //       namespace: REDIS_CACHE_CLIENT,
    //       host: process.env.REDIS_CACHE_HOST,
    //       port: parseInt(process.env.REDIS_CACHE_PORT, 10) || 6379,
    //       db: parseInt(process.env.REDIS_CACHE_DB, 10) || 15,
    //     },
    //   ],
    // }),
  ],
  controllers: [AppController, ViewController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CargoExceptionFilter,
    },
  ],
})
export class AppModule {}
