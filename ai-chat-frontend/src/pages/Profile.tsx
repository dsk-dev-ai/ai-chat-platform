import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [isDark, setIsDark] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "AI enthusiast and software developer passionate about creating innovative solutions.",
    avatar: "",
    joinDate: "2023-01-15",
    totalChats: 42,
    totalMessages: 156
  });

  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio
  });

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, [isDark]);

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      bio: user.bio
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-[var(--accent)] hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-lg font-semibold">Profile</h1>
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

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border)] mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(user.name)}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="Full Name"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    rows={3}
                    placeholder="Bio"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                  <p className="text-[var(--text-secondary)] mb-4">{user.email}</p>
                  <p className="text-[var(--text-primary)] mb-4">{user.bio}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border)] text-center">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">{user.totalChats}</div>
            <div className="text-[var(--text-secondary)]">Total Chats</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border)] text-center">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">{user.totalMessages}</div>
            <div className="text-[var(--text-secondary)]">Total Messages</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border)] text-center">
            <div className="text-3xl font-bold text-[var(--accent)] mb-2">
              {Math.floor((new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-[var(--text-secondary)]">Days Active</div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border)]">
          <h3 className="text-xl font-semibold mb-4">Account Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Member since:</span>
              <span>{new Date(user.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Account status:</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            to="/chat-history"
            className="flex-1 text-center px-6 py-3 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors"
          >
            View Chat History
          </Link>
          <Link
            to="/settings"
            className="flex-1 text-center px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-md hover:bg-[var(--border)] transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
