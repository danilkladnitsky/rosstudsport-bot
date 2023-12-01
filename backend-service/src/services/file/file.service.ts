import { InjectBot } from "nestjs-telegraf";
import https from 'https';
import { Telegraf } from "telegraf";
const fs = require("fs");

import { TelegrafContext } from "../../shared/telegraf";
import { BotInstances } from "../../shared/telegraf/bots";
import axios from "axios";

export class FileService {
    constructor(
        @InjectBot(BotInstances.ADMINISTRATOR_BOT) private readonly adminBot: Telegraf<TelegrafContext>,
    ) { }

    async downloadMedia(fileId: string) {
        try {
            const fileLink = await this.adminBot.telegram.getFileLink(fileId);
            const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });

            return Buffer.from(response.data, 'binary');

        } catch (error) {

        }
    }
}