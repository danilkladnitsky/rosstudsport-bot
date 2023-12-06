import { Command, Ctx, InjectBot, Message, On, SceneEnter, Wizard } from "nestjs-telegraf";
import { SCENES, TelegrafContext, UserMessage, WizardContext } from "../../../shared/telegraf";
import { BotInstances } from "../../../shared/telegraf/bots";
import { Telegraf } from "telegraf";
import { FileService } from "../../../services/file/file.service";
import { UserService } from "../../../services/user/user.service";
import { UserEntity } from "../../../database/entities/user.entity";


@Wizard(SCENES.ADMIN_BLOG)
export class BlogScene {
    constructor(
        @InjectBot(BotInstances.USER_BOT) private readonly userBot: Telegraf<TelegrafContext>,
        private readonly fileService: FileService,
        private readonly userService: UserService
    ) { }

    @Command('exit')
    async onExit(@Ctx() ctx: WizardContext) {
        await ctx.reply("Вы вернулись в главное меню");
        await ctx.scene.leave();
    }

    @SceneEnter()
    onSceneEnter(@Ctx() ctx: WizardContext) {
        ctx.reply('Режим блоггера включен. Вы можете отправить в чат изображение, серию изображений или видео в кружочках.')
    }

    private async wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async broadcastContent(actionFn: (user: UserEntity) => void) {
        const users = await this.userService.getAllUsers();

        for (const user of users) {
            try {
                await actionFn(user);
                await this.wait(30);
            } catch (error) {
                console.error(error);
            }
        }
    }

    @On('photo')
    async onPhotoSend(@Message() message: UserMessage) {
        try {
            const { photo, caption } = message;

            const photoId = photo[photo.length - 1].file_id;
            const mediaSource = await this.fileService.downloadMedia(photoId);

            this.broadcastContent(user => this.userBot.telegram.sendPhoto(
                user.telegramId,
                { source: mediaSource },
                { caption })
            );
        } catch (error) {
            console.log(error);
        }
    }

    @On('video_note')
    async onVideoNoteSend(@Message() message: UserMessage) {
        try {
            const { video_note } = message;

            const videoId = video_note.file_id;
            const mediaSource = await this.fileService.downloadMedia(videoId);

            this.broadcastContent(user => this.userBot.telegram.sendVideoNote
                (
                    user.telegramId,
                    { source: mediaSource }
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    @On('video')
    async onVideoSend(@Message() message: UserMessage) {
        try {
            const { video, caption } = message;

            const videoId = video.file_id;
            const mediaSource = await this.fileService.downloadMedia(videoId);

            this.broadcastContent(user => this.userBot.telegram.sendVideo(
                user.telegramId,
                { source: mediaSource },
                { caption })
            );
        } catch (error) {
            console.error(error);
        }
    }
}