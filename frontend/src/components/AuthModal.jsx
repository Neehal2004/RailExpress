import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { X, LogIn, UserPlus, UserCheck, AlertCircle, Train } from 'lucide-react';
import API_BASE from '../config/api';

const isClerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AuthModal({ initialMode = 'login', onClose, onSuccessNotification }) {
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = mode === 'login' ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
    const payload = mode === 'login' ? { email, password } : { name, email, phone, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || (res.status === 502 || res.status === 504 ? 'Backend server is unreachable. Please ensure the API is running.' : 'Authentication failed'));
      }

      login(data);
      if (onSuccessNotification) {
        onSuccessNotification({
          type: 'success',
          message: mode === 'login' ? `Welcome back, ${data.name}!` : 'Account created successfully!'
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Demo login failed');
      }

      login(data);
      if (onSuccessNotification) {
        onSuccessNotification({
          type: 'success',
          message: `Logged in as ${data.role.toUpperCase()} (${data.name})`
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="modal-content" style={{ maxWidth: isClerkConfigured ? '480px' : '440px', padding: '24px' }}>
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--accent-brass)',
            paddingBottom: '12px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Train size={18} style={{ color: 'var(--accent-brass)' }} />
            <h3 id="auth-modal-title" style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              {mode === 'login' ? 'Passenger Sign In' : 'New Passenger Registration'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            aria-pressed={mode === 'login'}
            style={{
              flex: 1,
              padding: '8px 12px',
              minHeight: '40px',
              borderRadius: 'var(--radius-sm)',
              background: mode === 'login' ? 'var(--accent-red)' : '#FFFFFF',
              border: mode === 'login' ? '1px solid var(--accent-red)' : '1px solid var(--border-color)',
              color: mode === 'login' ? '#ffffff' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <LogIn size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            aria-pressed={mode === 'register'}
            style={{
              flex: 1,
              padding: '8px 12px',
              minHeight: '40px',
              borderRadius: 'var(--radius-sm)',
              background: mode === 'register' ? 'var(--accent-red)' : '#FFFFFF',
              border: mode === 'register' ? '1px solid var(--accent-red)' : '1px solid var(--border-color)',
              color: mode === 'register' ? '#ffffff' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <UserPlus size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Register
          </button>
        </div>

        {/* Render Clerk authentication when publishable key is present */}
        {isClerkConfigured ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {mode === 'login' ? (
              <SignIn routing="virtual" appearance={{ elements: { rootBox: { width: '100%' } } }} />
            ) : (
              <SignUp routing="virtual" appearance={{ elements: { rootBox: { width: '100%' } } }} />
            )}
          </div>
        ) : (
          /* Standard Auth Form Fallback */
          <>
            <div style={{ marginBottom: '16px', padding: '10px 12px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-brass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-brass)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                ⚡ Fast Demo Authentication:
              </span>
              <button
                type="button"
                onClick={() => handleDemoLogin('john@example.com', 'User@123')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.75rem', width: '100%', minHeight: '34px' }}
              >
                <UserCheck size={13} style={{ color: 'var(--accent-brass)' }} /> Passenger Account (John Doe)
              </button>
            </div>

            {error && (
              <div role="alert" style={{ background: 'var(--status-cancelled-bg)', color: 'var(--accent-red)', border: '1px solid var(--status-cancelled-border)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Passenger Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@railway.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', minHeight: '44px', marginTop: '8px' }}
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In to RailExpress' : 'Complete Registration'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
