import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

export default function ChatHistory() {
  const [isDark, setIsDark] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: "1",
      title: "AI Assistant Conversation",
      lastMessage: "Thank you for the information!",
      timestamp: "2023-12-01T10:30:00Z",
      messageCount: 12
    },
    {
      id: "2",
      title: "Code Review Discussion",
      lastMessage: "The implementation looks good.",
      timestamp: "2023-11-30T15:45:00Z",
      messageCount: 8
    },
    {
      id: "3",
      title: "Project Planning",
      lastMessage: "Let's schedule a meeting for next week.",
      timestamp: "2023-11-29T09:20:00Z",
      messageCount: 15
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, [isDark]);

  const filteredChats = chats
    .filter(chat =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case "oldest":
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      setChats(prev => prev.filter(chat => chat.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-[var(--accent)] hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-lg font-semibold">Chat History</h1>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
              className="px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-4xl mx-auto p-4">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--border)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No chats found</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Start a new conversation to see your chat history."}
            </p>
            <Link
              to="/free-chat"
              className="inline-block px-6 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors"
            >
              Start New Chat
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{chat.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-2 line-clamp-2">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center text-xs text-[var(--text-secondary)]">
                      <span>{new Date(chat.timestamp).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{chat.messageCount} messages</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => alert(`Opening chat: ${chat.title}`)}
                      className="p-2 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white rounded-md transition-colors"
                      title="Open Chat"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                      title="Delete Chat"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
