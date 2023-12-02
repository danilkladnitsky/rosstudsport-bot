import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PollEntity } from "../../database/entities/poll.entity";

export class PollService {
    constructor(@InjectRepository(PollEntity) private pollRepository: Repository<PollEntity>) { }

    create(pollData: Partial<PollEntity>): Promise<PollEntity> {
        return this.pollRepository.save(pollData);
    }

}