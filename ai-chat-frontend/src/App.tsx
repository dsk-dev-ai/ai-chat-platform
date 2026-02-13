import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load components for better performance
const Landing = lazy(() => import('./pages/Landing'));
const FreeChat = lazy(() => import('./pages/FreeChat'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const ChatHistory = lazy(() => import('./pages/ChatHistory'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ resetError }: { resetError: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] p-4">
    <div className="max-w-md w-full space-y-6 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Failed to load page</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Something went wrong while loading this page. Please try again.
        </p>
      </div>
      <button
        onClick={resetError}
        className="px-6 py-3 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Router>
        <div className="app min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/free-chat" element={<FreeChat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat-history" element={<ChatHistory />} />
              {/* Catch all route for 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">404</h1>
                    <p className="text-[var(--text-secondary)] mb-6">Page not found</p>
                    <a
                      href="/"
                      className="px-6 py-3 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors inline-block"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
