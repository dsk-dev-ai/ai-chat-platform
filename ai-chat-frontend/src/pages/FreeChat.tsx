import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";

export default function FreeChat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const maxMessages = 5;

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  async function handleSend(text: string) {
    if (!text.trim() || messageCount >= maxMessages || isLoading) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setMessageCount(prev => prev + 1);
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/free-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error: Could not get response" }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            AI Chat Pro - Free Chat
          </h1>
          <span className="text-sm text-[var(--text-secondary)]">
            {messageCount}/{maxMessages} messages used
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-[var(--text-primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[var(--text-primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors duration-200 text-sm font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Welcome to AI Chat Pro
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Start a conversation with our AI assistant. You have {maxMessages} free messages.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m.content} isUser={m.role === "user"} />
          ))}
          {isLoading && <MessageBubble message="" isUser={false} isLoading={true} />}
          {messageCount >= maxMessages && (
            <div className="text-center p-6 bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded-lg mx-auto max-w-md">
              <p className="text-[var(--warning-text)] text-sm">
                You've reached the free chat limit. <Link to="/login" className="text-[var(--accent)] hover:underline font-medium">Sign in</Link> for unlimited access.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-[var(--border)] p-4 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
