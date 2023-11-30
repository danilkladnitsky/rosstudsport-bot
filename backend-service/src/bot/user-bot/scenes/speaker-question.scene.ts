import { Ctx, InjectBot, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";
import { Telegraf } from "telegraf";

import { SCENES, TelegrafContext, UserMessage, WizardContext } from "../../../shared/telegraf";
import { BotInstances } from "../../../shared/telegraf/bots";
import { getUserName } from "../../../utils/getUserName";

@Wizard(SCENES.QUESTION_TO_SPEAKER)
export class QuestionToSpeakerScene {
    constructor(@InjectBot(BotInstances.ADMINISTRATOR_BOT) private readonly adminBot: Telegraf<TelegrafContext>) { }

    @SceneEnter()
    async onSceneEnter(@Ctx() ctx: WizardContext) {
        await ctx.reply('Введите свой вопрос спикеру следующим сообщением');
    }

    @On("text")
    async handle(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
        try {
            const { text, from: { id: userId } } = message;
            const username = getUserName(ctx);

            await this.adminBot.telegram.sendMessage(userId, `Участник ${username} задал вопрос спикеру:\n\n"${text}"`);

            await ctx.reply('Ваш вопрос был отправлен!');
            await ctx.scene.leave();
        } catch (error) {
            console.error(error);
        }
    }
}