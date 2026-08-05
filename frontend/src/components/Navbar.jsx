import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Train, Search, Ticket, ShieldCheck, User as UserIcon, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, openAuthModal }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        background: 'rgba(11, 19, 43, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '14px 28px'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Train size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.1 }}>
              Rail<span style={{ color: 'var(--accent-cyan)' }}>Express</span>
            </h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              RESERVATION SYSTEM
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActivePage('search')}
            className={`btn btn-sm ${activePage === 'search' || activePage === 'home' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Search size={16} /> Search Trains
          </button>

          <button
            onClick={() => setActivePage('pnr')}
            className={`btn btn-sm ${activePage === 'pnr' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Ticket size={16} /> PNR Status
          </button>

          {user && (
            <button
              onClick={() => setActivePage('my-bookings')}
              className={`btn btn-sm ${activePage === 'my-bookings' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Ticket size={16} /> My Bookings
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              onClick={() => setActivePage('admin')}
              className={`btn btn-sm ${activePage === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ background: activePage === 'admin' ? 'var(--accent-gradient)' : 'rgba(245, 158, 11, 0.15)', color: activePage === 'admin' ? '#fff' : '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}
            >
              <ShieldCheck size={16} /> Admin Panel
            </button>
          )}
        </div>

        {/* Auth / User Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <UserIcon size={16} className="text-cyan-400" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: user.role === 'admin' ? '#fbbf24' : 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {user.role}
                  </div>
                </div>
              </div>
              <button onClick={logout} className="btn btn-sm btn-secondary" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => openAuthModal('login')} className="btn btn-sm btn-secondary">
                <LogIn size={16} /> Login
              </button>
              <button onClick={() => openAuthModal('register')} className="btn btn-sm btn-primary">
                <UserPlus size={16} /> Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
