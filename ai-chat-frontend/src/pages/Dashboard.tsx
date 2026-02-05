import { useState } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import { sendMessage } from "../api/api";

export function Dashboard() {
  const [messages, setMessages] = useState<any[]>([]);

  const handleSend = async (msg: string) => {
    setMessages([...messages, { text: msg, user: true }]);

    const res = await sendMessage(msg);

    setMessages(m => [...m, { text: res.reply, user: false }]);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m.text} isUser={m.user}/>
        ))}
      </div>

      <ChatInput onSend={handleSend}/>
    </div>
  );
}
