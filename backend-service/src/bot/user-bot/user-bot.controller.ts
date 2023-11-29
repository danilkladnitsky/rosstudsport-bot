import {
  Update,
  Ctx,
  Start,
  Command,
} from 'nestjs-telegraf';

import { TelegrafContext } from '../../shared/telegraf/context';
import { SCENES } from '../../shared/telegraf';
import { UserService } from '../../services/user/user.service';
import { CreateUserDto } from '../../shared/dto/user.create.dto';

@Update()
export class BotUpdate {
  constructor(private readonly userService: UserService) { }

  @Start()
  async onStart(@Ctx() ctx: TelegrafContext) {
    const { from } = ctx;

    const user = await this.userService.getUser(from.id);

    if (!user) {
      const newUser: CreateUserDto = {
        blocked: false,
        firstName: from.first_name,
        lastName: from.last_name,
        username: from.username,
        telegramId: from.id.toString(),
      }

      await this.userService.createUser(newUser);
    }

    await ctx.reply('Привет!');
  }

  @Command(SCENES.ASK)
  async onAsk(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.ASK);
  }

  @Command(SCENES.QUESTION_TO_SPEAKER)
  async onSpeakerQuestion(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.QUESTION_TO_SPEAKER);
  }

  @Command(SCENES.QR_CODE)
  async onQrCode(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.QR_CODE);
  }
}