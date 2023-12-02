import {
  Update,
  Ctx,
  Start,
  Command,
  On,
} from 'nestjs-telegraf';

import { TelegrafContext, WizardContext } from '../../shared/telegraf/context';
import { SCENES } from '../../shared/telegraf';
import { UserService } from '../../services/user/user.service';
import { CreateUserDto } from '../../shared/dto/user.create.dto';
import { PollService } from '../../services/poll/poll.service';
import { USER_BOT_MESSAGES } from '../../shared/dialogs/user-bot/messages';

@Update()
export class BotUpdate {
  constructor(private readonly userService: UserService, private readonly pollService: PollService) { }

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

    await ctx.reply(USER_BOT_MESSAGES.WELCOME);
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

  @On('poll')
  async onPoll(@Ctx() ctx: WizardContext) {
    try {
      const { poll } = ctx;
      const { id, options, question } = poll;

      this.pollService.create({ pollId: id, question, result: JSON.stringify(options) })
    } catch (error) {
      console.error(error);
    }
  }
}