import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "poll" })
export class PollEntity {
    @PrimaryColumn({ nullable: false })
    pollId: string;

    @Column({ nullable: false })
    question: string;

    @Column({ nullable: true })
    result: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}