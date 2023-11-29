import { Module } from "@nestjs/common";

import { BotUpdate } from "./user-bot.controller";
import { AskScene } from "./scenes/ask.scene";
import { QrCodeScene } from "./scenes/qrcode.scene";
import { QuestionToSpeakerScene } from "./scenes/speaker-question.scene";
import { UserModule } from "../../services/user/user.module";

@Module({
    imports: [UserModule],
    providers: [BotUpdate, AskScene, QrCodeScene, QuestionToSpeakerScene],
})
export class UserBotModule { }