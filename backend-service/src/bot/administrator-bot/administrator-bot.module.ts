import { Module } from "@nestjs/common";
import { AdministratorBotController } from "./administrator-bot.controller";
import { BroadcastScene } from "./scenes/broadcast.scene";
import { UserModule } from "../../services/user/user.module";
import { QuestionModule } from "../../services/question/question.module";
import { AnswerScene } from "./scenes/answer.scene";
import { BlogScene } from "./scenes/blog.scene";
import { FileModule } from "../../services/file/file.module";
import { PollScene } from "./scenes/poll.scene";

@Module({
    imports: [UserModule, QuestionModule, FileModule],
    providers: [AdministratorBotController, BroadcastScene, AnswerScene, BlogScene, PollScene]
})
export class AdministratorBotModule { }