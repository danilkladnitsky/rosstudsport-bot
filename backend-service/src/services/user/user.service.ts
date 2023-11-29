import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { CreateUserDto } from '../../shared/dto/user.create.dto';
import { BotInstances } from '../../shared/telegraf/bots';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelegrafContext } from '../../shared/telegraf';

const REQUESTS_PER_SECOND = 20;

export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectBot(BotInstances.USER_BOT) private readonly userBot: Telegraf<TelegrafContext>
    ) { }

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        try {
            return this.userRepository.save(user);
        } catch (error) {
            // Handle the error here
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getUser(telegramId: number): Promise<UserEntity> {
        try {
            return this.userRepository.findOne({ where: { telegramId: telegramId.toString() } });
        } catch (error) {
            // Handle the error here
            console.error('Error getting user:', error);
            throw error;
        }
    }

    async getAllUsers(): Promise<UserEntity[]> {
        try {
            return this.userRepository.find();
        } catch (error) {
            // Handle the error here
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    async getBlockedUsers(): Promise<UserEntity[]> {
        try {
            return this.userRepository.find({ where: { blocked: true } });
        } catch (error) {
            // Handle the error here
            console.error('Error getting blocked users:', error);
            throw error;
        }
    }

    async addPermissionToUser(
        telegramId: number,
        permission: string,
    ): Promise<UserEntity> {
        try {
            const user = await this.getUser(telegramId);

            if (!user.permissions.includes(permission)) {
                user.permissions.push(permission);
                return this.userRepository.save(user);
            } else {
                return user;
            }
        } catch (error) {
            // Handle the error here
            console.error('Error adding permission to user:', error);
            throw error;
        }
    }

    private async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateReport(users: (UserEntity & { reason?: string })[]) {
        return users.map((user) => {
            const name = user.username ? `@${user.username}` : `${user.firstName} ${user.lastName}`;

            return `Не смогли доставить: ${name}. Причина: ${user.reason}`;
        }).join(`/n`) || 'Нет отчета'
    }

    async sendMessageToAllUsers(message: string) {
        const users = await this.getAllUsers();
        const interval = 1000 / REQUESTS_PER_SECOND;

        const res = {
            total: users.length,
            successful: [],
            failed: []
        }

        for (const user of users) {
            try {
                await this.userBot.telegram.sendMessage(user.telegramId, message);
                await this.wait(interval);

                res.successful.push(user);
            } catch (error) {


                const errorResponse = error?.response || {};
                const reason = errorResponse.description || 'неизвестна';

                res.failed.push({ ...user, reason });
            }
        }

        return { ok: res.total === res.successful.length, res, report: this.generateReport(res.failed) };
    }
}