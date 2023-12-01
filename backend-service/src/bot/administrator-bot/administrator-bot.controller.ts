import { Action, Command, Ctx, Update } from "nestjs-telegraf";
import { SCENES, WizardContext } from "../../shared/telegraf";
import { AnswerUserQuestionQuery } from "../../shared/callbackQuery/question";

@Update()
export class AdministratorBotController {
    @Command(SCENES.ADMIN_BROADCAST)
    async onBroadcastMessage(@Ctx() ctx: WizardContext) {
        await ctx.scene.enter(SCENES.ADMIN_BROADCAST);
    }

    @Command(SCENES.ADMIN_BLOG)
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