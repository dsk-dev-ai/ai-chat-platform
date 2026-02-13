import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Animated Background Bubbles */}
      <div className="bubble-container">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bubble animate-bubble-float"></div>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass animate-scale-in hover:animate-pulse-glow transition-all duration-300"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="max-w-6xl mx-auto text-center px-4 relative z-10">
        {/* Animated Title */}
        <h1 className={`text-7xl font-bold mb-6 animate-float ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <span className="animate-rainbow-text bg-clip-text">AI Chat Pro</span>
        </h1>

        {/* Animated Subtitle */}
        <p className={`text-xl mb-12 animate-slide-in-left delay-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Experience the power of AI conversation with stunning animations and modern design
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-in-right delay-500">
          <div className={`glass p-6 rounded-2xl animate-scale-in ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-4 animate-pulse-glow"></div>
            <h3 className="font-semibold mb-2">Free Chat</h3>
            <p className="text-sm opacity-80">Start with 5 free messages</p>
          </div>
          <div className={`glass p-6 rounded-2xl animate-scale-in delay-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mx-auto mb-4 animate-pulse-glow"></div>
            <h3 className="font-semibold mb-2">Unlimited Access</h3>
            <p className="text-sm opacity-80">Sign up for premium features</p>
          </div>
          <div className={`glass p-6 rounded-2xl animate-scale-in delay-400 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg mx-auto mb-4 animate-pulse-glow"></div>
            <h3 className="font-semibold mb-2">AI Powered</h3>
            <p className="text-sm opacity-80">Advanced AI conversations</p>
          </div>
        </div>

        {/* Animated Buttons */}
        <div className="space-x-6 animate-fade-in delay-700">
          <Link
            to="/free-chat"
            className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 animate-pulse-glow"
          >
            🚀 Start Free Chat
          </Link>
          <Link
            to="/login"
            className={`inline-block px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-200'}`}
          >
            ✨ Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
