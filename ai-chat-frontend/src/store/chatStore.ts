import { create } from "zustand"
import { Message } from "../types/chat"

interface ChatStore {
  messages: Message[]
  setMessages: (msgs: Message[]) => void
  addMessage: (msg: Message) => void
}

export const useChatStore = create<ChatStore>((set)=>({
  messages: [],
  setMessages:(msgs: Message[])=>set({messages:msgs}),
  addMessage:(msg: Message)=>set((s)=>({messages:[...s.messages,msg]}))
}))
