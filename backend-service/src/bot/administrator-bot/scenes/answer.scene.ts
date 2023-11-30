import { Wizard } from "nestjs-telegraf";
import { SCENES } from "../../../shared/telegraf";

@Wizard(SCENES.ADMIN_BROADCAST)
export class AnswerScene {

}