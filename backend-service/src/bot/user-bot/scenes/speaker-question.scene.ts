import { Ctx, SceneEnter, Wizard } from "nestjs-telegraf";

import { SCENES, WizardContext } from "../../../shared/telegraf";

@Wizard(SCENES.QUESTION_TO_SPEAKER)
export class QuestionToSpeakerScene {
    
    @SceneEnter()
    onSceneEnter(@Ctx() ctx: WizardContext) {
        
    }
}