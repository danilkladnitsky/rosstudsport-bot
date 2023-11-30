import { Action, Command, Ctx, Update } from "nestjs-telegraf";
import { SCENES, WizardContext } from "../../shared/telegraf";

@Update()
export class AdministratorBotController {
    @Command(SCENES.ADMIN_BROADCAST)
    async onBroadcastMessage(@Ctx() ctx: WizardContext) {
        await ctx.scene.enter(SCENES.ADMIN_BROADCAST);
    }

    @Action('answer_on_question')
    async onUserQuestion(@Ctx() ctx: WizardContext) {
        await ctx.scene.enter(SCENES.ADMIN_ANSWER);
    }

}