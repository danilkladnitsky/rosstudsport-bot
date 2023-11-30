import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "questions" })
export class QuestionEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    sender: string;

    @Column({ nullable: true })
    text: string;

    @Column({ nullable: true })
    answer: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}