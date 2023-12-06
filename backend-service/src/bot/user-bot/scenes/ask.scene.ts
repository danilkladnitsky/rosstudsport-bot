import { Command, Ctx, InjectBot, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";

import { WizardContext, SCENES, TelegrafContext, UserMessage, } from "../../../shared/telegraf";
import { BotInstances } from "../../../shared/telegraf/bots";
import { Telegraf } from "telegraf";
import { getUserName } from "../../../utils/getUserName";
import { createAnswerQuestionKeyboard } from "../../../shared/dialogs/admin-bot/keyboard";

@Wizard(SCENES.ASK)
export class AskScene {
  constructor(@InjectBot(BotInstances.ADMINISTRATOR_BOT) private readonly adminBot: Telegraf<TelegrafContext>) { }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    await ctx.reply('Введите свой вопрос следующим сообщением:');
  }

  @Command('exit')
  async onExit(@Ctx() ctx: WizardContext) {
    await ctx.reply("Вы вернулись в главное меню");
    await ctx.scene.leave();
  }

  async wait() {
    return new Promise((resolve) => {
      setTimeout(resolve, 50);
    })
  }

  @On("text")
  async handle(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
    const { text, from: { id: userId }, message_id } = message;
    const username = getUserName(ctx);

    const ADMIN_IDS = [257444253, 417259904, 414568248, 938705866, 1385842309, 1019818182, 466550215];

    try {
      for (const admin of ADMIN_IDS) {
        await this.adminBot.telegram.sendMessage(admin, `Участник ${username} задал вопрос:\n\n"${text}"`,
          { reply_markup: createAnswerQuestionKeyboard(message_id, userId) });
        await this.wait();
      }


      await ctx.reply('Ваш вопрос был отправлен администратору! Ждите ответа.');
      await ctx.scene.leave();
    } catch (error) {
      console.error(error);
    }
  }
}