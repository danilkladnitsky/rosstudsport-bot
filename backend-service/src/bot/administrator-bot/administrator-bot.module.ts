import { Module } from "@nestjs/common";
import { AdministratorBotController } from "./administrator-bot.controller";
import { BroadcastScene } from "./scenes/broadcast.scene";
import { UserModule } from "../../services/user/user.module";

@Module({
    imports: [UserModule],
    providers: [AdministratorBotController, BroadcastScene]
})
export class AdministratorBotModule { }