import { Keyboard } from "telegram-keyboard";

export const BroadcastKeyboards = Keyboard.inline([
    [{
        text: "📧 Отправить",
        callback_data: "accept",
    }],
    [{
        text: "🕑 Отправить через 10 минут",
        callback_data: "schedule",
    }],
    [{
        text: "❌ Отмена",
        callback_data: "decline"
    }]
]).reply_markup;

export const createAnswerQuestionKeyboard = (messageId: number, userId: number) => Keyboard.inline([
    {
        text: "Ответить на вопрос",
        callback_data: `question_${messageId}_${userId}`,
    }
]).reply_markup;