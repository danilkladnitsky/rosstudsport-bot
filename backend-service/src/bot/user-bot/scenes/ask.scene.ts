import { Ctx, InjectBot, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";
import { Telegraf } from "telegraf";

import { WizardContext, UserMessage, SCENES, TelegrafContext } from "../../../shared/telegraf";
import { getUserName } from "../../../utils/getUserName";
import { BotInstances } from "../../../shared/telegraf/bots";

@Wizard(SCENES.ASK)
export class AskScene {
  constructor(@InjectBot(BotInstances.ADMINISTRATOR_BOT) private readonly adminBot: Telegraf<TelegrafContext>) { }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    await ctx.reply('Введите свой вопрос следующим сообщением');
  }

  @On("text")
  async handle(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
    try {
      const { text, from: { id: userId } } = message;

      const username = getUserName(ctx);

      await this.adminBot.telegram.sendMessage(userId, `Вам пришел вопрос от участника форума. Чтобы ответить, нажмите на кнопку "Ответить" под следующим сообщением.`);
      await this.adminBot.telegram.sendMessage(userId, `Пользователь: ${username} прислал вопрос:\n\n"${text}"`);

      await ctx.reply('Ваш вопрос был отправлен администратору!');
      await ctx.scene.leave();
    } catch (error) {
      console.error(error);
    }
  }
}