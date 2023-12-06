import { Action, Ctx, Start, Update } from "nestjs-telegraf";

import { SCENES, WizardContext } from "../../shared/telegraf";
import { AnswerUserQuestionQuery } from "../../shared/callbackQuery/question";
import { adminKeyboard } from "../../shared/dialogs/admin-bot/keyboard";
import { AdminGuard } from "./guards/admin.guard";
import { UseFilters, UseGuards } from "@nestjs/common";
import { TelegrafExceptionFilter } from "../../shared/filters/telegraf-exception.filter";

@Update()
@UseGuards(AdminGuard)
@UseFilters(TelegrafExceptionFilter)
export class AdministratorBotController {

    @Start()
    async onStart(@Ctx() ctx: WizardContext) {
        await ctx.reply('Добро пожаловать в режим администратора.', { reply_markup: adminKeyboard })
    }

    @Action("poll")
    async onPoll(@Ctx() ctx: WizardContext) {
        await ctx.scene.enter(SCENES.ADMIN_POLL);
    }

    @Action("broadcast")
    async onBroadcastMessage(@Ctx() ctx: WizardContext) {
        await ctx.scene.enter(SCENES.ADMIN_BROADCAST);
    }

    @Action("blog")
    async onBlogEnter(@Ctx() ctx: WizardContext) {
        await ctx.scene.enter(SCENES.ADMIN_BLOG);
    }

    @Action(/question\_(\d+)/gm)
    async onUserQuestion(@Ctx() ctx: WizardContext) {
        try {
            const { callbackQuery } = ctx;
            const query = callbackQuery.data || "";

            const [, messageId, userId] = query.split("_");

            const scenePayload: AnswerUserQuestionQuery = {
                messageId,
                userId,
            }

            await ctx.editMessageReplyMarkup(undefined);
            await ctx.scene.enter(SCENES.ADMIN_ANSWER, scenePayload);
        } catch (error) {
            console.error(error);
        }
    }
}