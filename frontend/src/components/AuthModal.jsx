import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, LogIn, UserPlus, Shield, UserCheck, AlertCircle } from 'lucide-react';
import API_BASE from '../config/api';

export default function AuthModal({ initialMode = 'login', onClose, onSuccessNotification }) {
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('passenger');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = mode === 'login' ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
    const payload = mode === 'login' ? { email, password } : { name, email, phone, password, role };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
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
      setError(err.message);
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
      const data = await res.json();

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '14px',
            marginBottom: '16px'
          }}
        >
          <h3 id="auth-modal-title" style={{ fontSize: '1.25rem', color: '#fff' }}>
            {mode === 'login' ? 'User Login' : 'Create Account'}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-secondary" aria-label="Close modal">
            <X size={18} />
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
              padding: '10px',
              minHeight: '44px',
              borderRadius: 'var(--radius-sm)',
              background: mode === 'login' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            aria-pressed={mode === 'register'}
            style={{
              flex: 1,
              padding: '10px',
              minHeight: '44px',
              borderRadius: 'var(--radius-sm)',
              background: mode === 'register' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            Register
          </button>
        </div>

        {/* Quick Demo Credentials Buttons */}
        <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px dashed rgba(59, 130, 246, 0.3)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            ⚡ One-Click Quick Demo Login:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('john@example.com', 'User@123')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', width: '100%' }}
            >
              <UserCheck size={14} className="text-cyan-400" /> Passenger Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@railway.com', 'Admin@123')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', width: '100%', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
            >
              <Shield size={14} /> Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
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

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="passenger">Passenger (Book & Manage Tickets)</option>
                  <option value="admin">Railway Admin (Manage Schedules & Reports)</option>
                </select>
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
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
