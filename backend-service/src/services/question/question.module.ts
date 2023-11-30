import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionEntity } from "../../database/entities/question.entity";
import { QuestionService } from "./question.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([QuestionEntity]),
    ],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule { }