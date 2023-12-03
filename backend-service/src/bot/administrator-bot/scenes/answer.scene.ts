import { Command, Ctx, InjectBot, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";
import { SCENES, TelegrafContext, UserMessage, WizardContext } from "../../../shared/telegraf";
import { AnswerUserQuestionQuery } from "../../../shared/callbackQuery/question";
import { BotInstances } from "../../../shared/telegraf/bots";
import { Telegraf } from "telegraf";

@Wizard(SCENES.ADMIN_ANSWER)
export class AnswerScene {
    constructor(
        @InjectBot(BotInstances.USER_BOT) private readonly userBot: Telegraf<TelegrafContext>,
        @InjectBot(BotInstances.ADMINISTRATOR_BOT) private readonly adminBot: Telegraf<TelegrafContext>,
    ) {
    }

    @Command('exit')
    async onExit(@Ctx() ctx: WizardContext) {
        await ctx.reply("Вы вернулись в главное меню");
        await ctx.scene.leave();
    }

    @SceneEnter()
    async onEnter(@Ctx() ctx: WizardContext) {
        try {
            await ctx.reply('Введите ответ на вопрос участника:');
        } catch (error) {
            console.error(error);
        }
    }

    @On('text')
    async onAnswer(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
        try {
            const { text } = message;
            const { messageId, userId } = ctx.scene.session.state as AnswerUserQuestionQuery;

            await this.userBot.telegram.sendMessage(userId, `Ответ администратора: \n\n"${text}"`, { reply_to_message_id: messageId });

            await ctx.reply("Ответ был отправлен!");
            await ctx.scene.leave();
        } catch (error) {
            console.error(error);
        }
    }
}