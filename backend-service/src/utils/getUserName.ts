import { TelegrafContext } from "../shared/telegraf";

export const getUserName = (ctx: TelegrafContext) => {
    const { message: { from } } = ctx;

    const { first_name, username, last_name } = from;

    const userTag = username ? `@${username}` : `${first_name} ${last_name}`;

    return userTag;
}