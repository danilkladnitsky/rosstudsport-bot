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

export const AnswerQuestionKeyboard = Keyboard.inline([
    {
        text: "Ответить на вопрос",
        callback_data: "answer_on_question"
    }
]).reply_markup;