import { InjectRepository } from "@nestjs/typeorm";
import { QuestionEntity } from "../../database/entities/question.entity";
import { Repository } from "typeorm";

export class QuestionService {
    constructor(
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>,
    ) { }

    async create(questionData: Partial<QuestionEntity>): Promise<QuestionEntity> {
        return this.questionRepository.save(questionData);
    }

    async update(id: number, questionData: Partial<QuestionEntity>): Promise<QuestionEntity | undefined> {
        await this.questionRepository.update(id, questionData);
        return this.questionRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.questionRepository.delete(id);
    }

    async getById(id: number): Promise<QuestionEntity | undefined> {
        return this.questionRepository.findOne({ where: { id } });
    }

    async getAll(): Promise<QuestionEntity[]> {
        return this.questionRepository.find();
    }

    async answerQuestion(id: number, answer: string): Promise<QuestionEntity | undefined> {
        const question = await this.getById(id);

        if (question) {
            question.answer = answer;
            return this.questionRepository.save(question);
        }
    }

    async getUnansweredQuestions(): Promise<QuestionEntity[]> {
        return this.questionRepository.find({ where: { answer: null } });
    }
}