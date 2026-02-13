import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, sendVerificationCode } from "../api/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [fallbackToken, setFallbackToken] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setLoadingSend(true);
    setError("");
    try {
      const response = await sendVerificationCode(email);
      setCodeSent(true);
      // If token is returned in response (fallback for email failure), show it
      if (response.token) {
        setFallbackToken(response.token);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to send registration token");
    } finally {
      setLoadingSend(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRegister(true);
    setError("");
    try {
      await register(email, password, token);
      navigate("/login");
    } catch (error: any) {
      setError(error.response?.data?.error || "Registration failed");
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-pink-900 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Bubbles */}
      <div className="bubble-container">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bubble animate-bubble-float"></div>
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="animate-scale-in">
          <h2 className="mt-6 text-center text-4xl font-bold animate-rainbow-text">
            Join AI Chat Pro
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2 animate-fade-in delay-200">
            Start your journey with unlimited AI conversations
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {!codeSent ? (
            <div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!email || loadingSend}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSend ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          ) : (
            <>
              {fallbackToken && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Registration Token
                      </h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Email sending failed. Copy this token to complete your registration:
                      </p>
                      <div className="bg-white border border-blue-300 rounded-md p-4">
                        <code className="text-sm font-mono text-blue-900 break-all select-all">
                          {fallbackToken}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(fallbackToken)}
                        className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Token
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter registration token from email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loadingRegister}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingRegister ? "Signing up..." : "Sign up"}
                </button>
              </div>
            </>
          )}
          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
