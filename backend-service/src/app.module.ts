import { Module } from '@nestjs/common';
import {
  ConfigModule
} from '@nestjs/config';

import { S3Module } from 'nestjs-s3';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotInstances } from './shared/telegraf/bots';
import { UserBotModule } from './bot/user-bot/user-bot.module';
import { sessionMiddleware } from './middleware/session';
import { AdministratorBotModule } from './bot/administrator-bot/administrator-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        },
        region: 'ru-1',
        endpoint: process.env.S3_URL,
        forcePathStyle: true,
      },
    }),
    TelegrafModule.forRootAsync({
      botName: BotInstances.USER_BOT,
      useFactory: () => {
        return {
          token: process.env.USER_BOT_TOKEN,
          include: [UserBotModule],
          middlewares: [sessionMiddleware]
        }
      },
    }),
    TelegrafModule.forRootAsync({
      botName: BotInstances.ADMINISTRATOR_BOT,
      useFactory: () => {
        return {
          token: process.env.ADMINISTRATOR_BOT_TOKEN,
          include: [AdministratorBotModule],
          middlewares: [sessionMiddleware]
        }
      },
    }),
    UserBotModule,
    AdministratorBotModule
  ],
})
export class AppModule { }
