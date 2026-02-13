import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { sendMessage } from "../api/chat";
import { fetchHistory, fetchUserChats, createChat } from "../api/history";
import { getCurrentUser } from "../api/auth";
import { useChatStore } from "../store/chatStore";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import { Message } from "../types/chat";

interface Chat {
  id: number;
  title: string;
  created_at?: string;
  createdAt?: string;
}

interface User {
  id: number;
  email: string;
}

export default function Dashboard() {
  const { messages, setMessages, addMessage } = useChatStore();
  const [chatId, setChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Safe Date Formatter
  const formatDate = (date?: string) => {
    if (!date) return "Just now";
    const parsed = new Date(date);
    return isNaN(parsed.getTime())
      ? "Just now"
      : parsed.toLocaleString();
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    loadUser();
  }, []);

  const loadChats = async () => {
    try {
      const userChats = await fetchUserChats();
      setChats(userChats);

      if (userChats.length > 0) {
        setChatId(userChats[0].id);
        const history = await fetchHistory(userChats[0].id);
        setMessages(history);
      } else {
        const newChat = await createChat();
        setChatId(newChat.id);
        setChats([newChat]);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (selectedChatId: number) => {
    setChatId(selectedChatId);
    try {
      const history = await fetchHistory(selectedChatId);
      setMessages(history);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([]);
    }
  };

  const createNewChat = async () => {
    try {
      const newChat = await createChat();
      setChats(prev => [newChat, ...prev]);
      setChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  async function handleSend(text: string) {
    if (!text.trim() || !chatId || sending) return;

    addMessage({ role: "user", content: text });
    setSending(true);

    try {
      const res = await sendMessage(chatId, text);
      addMessage({ role: "ai", content: res.reply });
    } catch {
      addMessage({ role: "ai", content: "Error: Could not get response" });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r flex flex-col`}>
        
        <div className="p-4 border-b">
          <button
            onClick={createNewChat}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + New Chat
          </button>
          <p className="text-xs text-gray-500 mt-2">
            {chats.length} Chats
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 ${
                chatId === chat.id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <div className="text-sm font-medium truncate">
                {chat.title}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(chat.created_at || chat.createdAt)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <div>
              <h1 className="font-semibold text-lg">AI Chat Pro</h1>
              {user && (
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <h2 className="text-xl font-semibold">
                Welcome{user ? `, ${user.email}` : ""} 👋
              </h2>
              <p className="text-gray-500">
                Start chatting with AI.
              </p>
            </div>
          ) : (
            messages.map((m: Message, i: number) => (
              <MessageBubble
                key={i}
                message={m.content}
                isUser={m.role === "user"}
              />
            ))
          )}
          {sending && <MessageBubble message="" isUser={false} isLoading />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-white">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
