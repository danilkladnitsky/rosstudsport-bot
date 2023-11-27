import {
  Update,
  Ctx,
  Start,
  Command,
  InjectBot,
} from 'nestjs-telegraf';
import { TelegrafContext } from '../../shared/telegraf/context';
import { Telegraf } from 'telegraf';
import { SCENES } from '../../shared/telegraf';

@Update()
export class BotUpdate {
  constructor(@InjectBot('USER_BOT') private bot: Telegraf<TelegrafContext>) {
  }

  @Start()
  async onStart(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Бот работает! Отправьте следующим видео для детекции дорожных знаков.');
  }

  @Command(SCENES.ASK)
  async onAsk(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.ASK);
  }

  @Command(SCENES.QR_CODE)
  async onQrCode(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.QR_CODE);
  }
}