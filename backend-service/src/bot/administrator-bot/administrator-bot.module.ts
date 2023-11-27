import { Module } from "@nestjs/common";
import { AdministratorBotController } from "./administrator-bot.controller";

@Module({
    providers: [AdministratorBotController]
})
export class AdministratorBotModule { }