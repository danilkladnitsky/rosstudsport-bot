import { Action, Command, Ctx, InjectBot, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import schedule from "node-schedule";

import { SCENES, TelegrafContext, UserMessage, WizardContext } from "../../../shared/telegraf";
import { BotInstances } from "../../../shared/telegraf/bots";
import { ADMIN_BOT_MESSAGES } from "../../../shared/dialogs/admin-bot/messages";
import { BroadcastKeyboards } from "../../../shared/dialogs/admin-bot/keyboard";
import { UserService } from "../../../services/user/user.service";


@Wizard(SCENES.ADMIN_BROADCAST)
export class BroadcastScene {
    messagesQueue: string[];
    jobQueue: { job: any; message: string; }[];

    constructor(
        @InjectBot(BotInstances.USER_BOT) private readonly userBot: Telegraf<TelegrafContext>,
        @InjectBot(BotInstances.ADMINISTRATOR_BOT) private readonly adminBot: Telegraf<TelegrafContext>,
        private readonly userService: UserService
    ) {
        this.messagesQueue = [];
        this.jobQueue = [];
    }

    @Command('exit')
    async onExit(@Ctx() ctx: WizardContext) {
        await ctx.reply("Вы вернулись в главное меню");
        await ctx.scene.leave();
    }

    @SceneEnter()
    async onSceneEnter(@Ctx() ctx: WizardContext) {
        await ctx.reply(ADMIN_BOT_MESSAGES.BROADCAST_MESSAGE);
    }

    @Command('clear')
    async onJobClear(@Ctx() ctx: WizardContext) {
        if (this.jobQueue.length === 0) {
            ctx.reply("Очередь отложенных сообщений пуста!");
            return;
        }

        this.jobQueue.forEach(({ job, message }) => {
            job.cancel();
            ctx.reply(`Отложенная отправка сообщения: \n\n"${message}"\n\n была отменена!`);
        });

    }

    @Command('exit')
    async exit(@Ctx() ctx: WizardContext) {
        await ctx.reply('Вы покинули режим отправки сообщений.');
        await ctx.scene.leave();
    }

    @On('text')
    async validateMessage(@Ctx() ctx: WizardContext, @Message() previewMessage: UserMessage) {
        const { text } = previewMessage;
        this.messagesQueue.push(text);

        await ctx.reply(`Пользователям будет отправлено следующее сообщение: \n\n"${text}"`, { reply_markup: BroadcastKeyboards });
    }

    @Action('accept')
    async onAccept(@Ctx() ctx: WizardContext) {
        const { from } = ctx;

        const message = this.messagesQueue.pop();
        await ctx.editMessageReplyMarkup(null);
        await ctx.editMessageText("Отправляем...");
        const result = await this.userService.sendMessageToAllUsers(message);

        const { ok, res, report } = result;

        if (ok) {
            await ctx.editMessageText("Все сообщения были успешно отправлены! Для отправки нового сообщения снова введите /broadcast.");
            await ctx.scene.leave();
        } else {
            await ctx.editMessageText("Сообщение было отправлено, но не всем пользователям. Отчет будет отправлен следующим сообщением. Для отправки нового сообщения введите /broadcast.");
            await ctx.reply(`Всего получателей: ${res.total}\nДоставлено успешно: ${res.successful.length} сообщений\nНеуспешно: ${res.failed.length}`);
            await ctx.reply(report);
        }

    }

    @Action('schedule')
    async onSchedule(@Ctx() ctx: WizardContext) {
        const { from } = ctx;

        const message = this.messagesQueue.pop();

        const newJob = schedule.scheduleJob('*/1 * * * *', () => {
            this.userService.sendMessageToAllUsers(message);
            this.adminBot.telegram.sendMessage(from.id, `Отложенное сообщение было отправлено!`)
        });

        this.jobQueue.push({ job: newJob, message });


        await ctx.editMessageReplyMarkup(null);
        await ctx.editMessageText("Сообщение будет отправлено через 10 минут. Для отмены действия включите режим рассылки (/broadcast) и введите /clear.");

        await ctx.scene.leave();
    }

    @Action('decline')
    async onDecline(@Ctx() ctx: WizardContext) {
        await ctx.editMessageReplyMarkup(null);

        await ctx.editMessageText("Сообщение не будет отправлено. Для отправки нового сообщения всем участникам введите /broadcast.");

        await ctx.scene.leave();
    }


}