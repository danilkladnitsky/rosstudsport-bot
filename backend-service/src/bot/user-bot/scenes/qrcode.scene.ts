import { Command, Ctx, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";
import { InjectS3, S3 } from "nestjs-s3";

import { SCENES, UserMessage, WizardContext } from "../../../shared/telegraf";
import { USER_BOT_MESSAGES } from "../../../shared/dialogs/user-bot/messages";

@Wizard(SCENES.QR_CODE)
export class QrCodeScene {
    constructor(
        @InjectS3() private readonly s3: S3,
    ) { }

    private generatePersonalQrCode = async (userMessage: string): Promise<{ ok: boolean, source?: Buffer }> => {
        try {
            const FILENAME = `${userMessage}.png`;
            const KEY = `qrcodes/${FILENAME}`;

            const bodyResponse = (await this.s3.getObject({
                Bucket: process.env.S3_BUCKET,
                Key: KEY, ResponseContentType: 'image/png',
            })).Body;

            const rawImage = await bodyResponse.transformToString('base64');
            const buffer = Buffer.from(rawImage, 'base64');

            return { ok: true, source: buffer };
        } catch (error) {
            return { ok: false }

        }
    }

    @SceneEnter()
    async onSceneEnter(@Ctx() ctx: WizardContext) {
        await ctx.reply(USER_BOT_MESSAGES.GET_QRCODE);
    }

    @Command('exit')
    async onExit(@Ctx() ctx: WizardContext) {
        await ctx.reply("Вы вернулись в главное меню");
        await ctx.scene.leave();
    }

    @On('text')
    async onText(@Ctx() ctx: WizardContext, @Message() message: UserMessage) {
        try {
            const { text } = message;

            const { ok, source } = await this.generatePersonalQrCode(text);

            if (ok) {
                await ctx.replyWithPhoto({ source, filename: `QR-код для участника ${text}` });
                await ctx.scene.leave();
                return;
            }

            await ctx.reply(USER_BOT_MESSAGES.NO_PERSONAL_QRCODE);
            await ctx.scene.leave();
        } catch (error) {
            console.error(error);
            await ctx.reply(USER_BOT_MESSAGES.NO_PERSONAL_QRCODE);
            await ctx.scene.leave();
        }
    }
}