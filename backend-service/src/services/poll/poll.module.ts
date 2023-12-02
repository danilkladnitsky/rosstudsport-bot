import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PollService } from "./poll.service";
import { PollEntity } from "../../database/entities/poll.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PollEntity])],
    providers: [PollService],
    exports: [PollService]
})
export class PollModule { }