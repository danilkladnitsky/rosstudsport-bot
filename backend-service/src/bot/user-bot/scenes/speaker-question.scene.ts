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

    async wait() {
        return new Promise((resolve) => {
            setTimeout(resolve, 50);
        })
    }

    @On("text")
    async handle(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
        try {
            const { text, from: { id: userId } } = message;
            const username = getUserName(ctx);

            const ADMIN_IDS = [257444253, 417259904, 414568248, 938705866, 1385842309, 1019818182, 466550215];

            for (const admin of ADMIN_IDS) {
                await this.adminBot.telegram.sendMessage(admin, `Участник ${username} задал вопрос спикеру:\n\n"${text}"`);
                await this.wait();
            }

            await ctx.reply('Ваш вопрос был отправлен!');
            await ctx.scene.leave();
        } catch (error) {
            console.error(error);
        }
    }
}