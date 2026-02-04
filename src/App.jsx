import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { isConfigured } from './firebase';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';

function SetupScreen() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Setup Required</h1>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          The application is running, but it's not connected to Firebase yet.
        </p>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Next Steps:</p>
          <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
            <li>Create a <code>.env</code> file in the project root.</li>
            <li>Copy the contents from <code>.env.example</code>.</li>
            <li>Fill in your Firebase API keys from the Firebase Console.</li>
            <li>Restart the development server if needed (Ctrl+C, then <code>npm run dev</code>).</li>
          </ol>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Once configured, this screen will automatically vanish and you can log in.
        </p>
      </div>
    </div>
  );
}

function App() {
  if (!isConfigured) {
    return <SetupScreen />;
  }

  return (
    <Router>
      <AuthProvider>
        <div className="app-layout">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/applications" element={
              <PrivateRoute>
                <Applications />
              </PrivateRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
