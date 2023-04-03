import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";

interface Session {
    currentTestId: number | null
}

export type MyContext = Context & ConversationFlavor & SessionFlavor<Session>;
export type MyConversation = Conversation<MyContext>;