import { Module } from "@nestjs/common";
import { AdministratorBotController } from "./administrator-bot.controller";
import { BroadcastScene } from "./scenes/broadcast.scene";
import { UserModule } from "../../services/user/user.module";
import { QuestionModule } from "../../services/question/question.module";

@Module({
    imports: [UserModule, QuestionModule],
    providers: [AdministratorBotController, BroadcastScene]
})
export class AdministratorBotModule { }