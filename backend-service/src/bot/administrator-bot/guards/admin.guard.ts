import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
export class AdminGuard implements CanActivate {
    private readonly ADMIN_IDS = [257444253, 417259904, 414568248, 938705866, 1385842309, 1019818182, 466550215];

    canActivate(context: ExecutionContext): boolean {
        const ctx = TelegrafExecutionContext.create(context);
        const { from } = ctx.getContext<Context>();

        const isAdmin = this.ADMIN_IDS.includes(from.id);
        if (!isAdmin) {
            throw new TelegrafException('You are not admin 😡');
        }

        return true;
    }
}