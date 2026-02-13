interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

export default function MessageBubble({ message, isUser, isLoading }: MessageBubbleProps) {
  if (isLoading) {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 max-w-xs">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-gray-500 text-sm">AI is thinking...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
        }`}
      >
        <p className="break-words text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
