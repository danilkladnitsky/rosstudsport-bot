import { Ctx, InjectBot, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";

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

  @On("text")
  async handle(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
    const { text, from: { id: userId }, message_id } = message;
    const username = getUserName(ctx);

    try {
      await this.adminBot.telegram.sendMessage(userId, `Участник ${username} задал вопрос:\n\n"${text}"`,
        { reply_markup: createAnswerQuestionKeyboard(message_id, userId) });
      await ctx.reply('Ваш вопрос был отправлен администратору! Ждите ответа.');
      await ctx.scene.leave();
    } catch (error) {
      console.error(error);
    }
  }
}