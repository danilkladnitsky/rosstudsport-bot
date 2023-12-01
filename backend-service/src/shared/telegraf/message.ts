import { TelegrafContext } from "./context";

export type UserMessage = TelegrafContext['message'] & {
    text: string;
    message_id: number;
};
