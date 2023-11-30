import { Ctx, On, SceneEnter, Wizard } from "nestjs-telegraf";

import { WizardContext, SCENES, } from "../../../shared/telegraf";

@Wizard(SCENES.ASK)
export class AskScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    await ctx.reply('Введите свой вопрос следующим сообщением');
  }

  @On("text")
  async handle(@Ctx() ctx: WizardContext) {
    try {
      await ctx.reply('Ваш вопрос был отправлен администратору!');
      await ctx.scene.leave();
    } catch (error) {
      console.error(error);
    }
  }
}