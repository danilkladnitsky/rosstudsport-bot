import { Action, Ctx, InjectBot, Message, On, Wizard, WizardStep } from "nestjs-telegraf";
import { SCENES, TelegrafContext, UserMessage, WizardContext } from "../../../shared/telegraf";
import { BotInstances } from "../../../shared/telegraf/bots";
import { Telegraf } from "telegraf";
import { confirmPollKeyboard } from "../../../shared/dialogs/admin-bot/keyboard";
import { UserService } from "../../../services/user/user.service";
import { wait } from "../../../utils/wait";


@Wizard(SCENES.ADMIN_POLL)
export class PollScene {
    title: string;
    content: string;

    constructor(
        @InjectBot(BotInstances.USER_BOT) private readonly userBot: Telegraf<TelegrafContext>,
        private userService: UserService
    ) {
        this.title = "Опрос";
        this.content = "?";
    }

    private async broadcastPoll() {
        const users = await this.userService.getAllUsers();
        const pollContent = this.content.split("\n");
        const pollTitle = this.title;

        for (const user of users) {
            try {
                await this.userBot.telegram.sendPoll(user.telegramId, pollTitle, pollContent, {
                    allows_multiple_answers: true,
                });
                await wait();
            } catch (error) {
                console.error(error);
            }
        }
    }

    @WizardStep(1)
    async onSceneEnter(@Ctx() ctx: WizardContext) {
        await ctx.reply(`Отправьте название опроса:`);
        await ctx.wizard.next();
    }

    @On('text')
    @WizardStep(2)
    async onPollTitle(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
        const { text } = message;
        this.title = text;
        await ctx.reply(`Отправьте содержимое опроса:`);
        await ctx.wizard.next();
    }

    @On('text')
    @WizardStep(3)
    async onPollContent(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
        const { text } = message;
        this.content = text;

        await ctx.reply(`Вот так будет выглядеть опрос у участников.`);

        await ctx.replyWithPoll(this.title, this.content.split("\n"), {
            allows_multiple_answers: true,
            reply_markup: confirmPollKeyboard
        });
    }

    @Action("confirm")
    async onPollConfirm(@Ctx() ctx: WizardContext) {
        await ctx.reply("Голосование было отправлено!");

        await this.broadcastPoll();
        await ctx.scene.leave();
    }
}