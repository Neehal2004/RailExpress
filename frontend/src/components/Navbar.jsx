import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Train, Search, Ticket, ShieldCheck, User as UserIcon, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, openAuthModal }) {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main Navigation"
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '12px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('home'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Train size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1, color: '#fff' }}>
                Rail<span style={{ color: '#60a5fa' }}>Express</span>
              </h2>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Indian Railways Reservation
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <button
              onClick={() => handleNavClick('search')}
              className={`btn btn-sm ${activePage === 'search' || activePage === 'home' ? 'btn-primary' : 'btn-secondary'}`}
              aria-current={activePage === 'search' ? 'page' : undefined}
            >
              <Search size={15} /> Search Trains
            </button>

            <button
              onClick={() => handleNavClick('pnr')}
              className={`btn btn-sm ${activePage === 'pnr' ? 'btn-primary' : 'btn-secondary'}`}
              aria-current={activePage === 'pnr' ? 'page' : undefined}
            >
              <Ticket size={15} /> PNR Status
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('my-bookings')}
                className={`btn btn-sm ${activePage === 'my-bookings' ? 'btn-primary' : 'btn-secondary'}`}
                aria-current={activePage === 'my-bookings' ? 'page' : undefined}
              >
                <Ticket size={15} /> My Bookings
              </button>
            )}

            {user && user.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`btn btn-sm ${activePage === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  background: activePage === 'admin' ? 'var(--accent-amber)' : 'rgba(217, 119, 6, 0.15)',
                  color: activePage === 'admin' ? '#fff' : '#fbbf24',
                  borderColor: 'rgba(217, 119, 6, 0.35)'
                }}
                aria-current={activePage === 'admin' ? 'page' : undefined}
              >
                <ShieldCheck size={15} /> Admin Panel
              </button>
            )}
          </div>

          {/* Desktop User / Auth Actions */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 12px',
                    background: '#0f172a',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <UserIcon size={15} style={{ color: '#60a5fa' }} />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: user.role === 'admin' ? '#fbbf24' : '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
                      {user.role}
                    </div>
                  </div>
                </div>
                <button onClick={logout} className="btn btn-sm btn-secondary" title="Logout" aria-label="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => openAuthModal('login')} className="btn btn-sm btn-secondary">
                  <LogIn size={15} /> Login
                </button>
                <button onClick={() => openAuthModal('register')} className="btn btn-sm btn-primary">
                  <UserPlus size={15} /> Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            style={{
              display: 'none',
              background: '#0f172a',
              border: '1px solid var(--border-color)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              cursor: 'pointer',
              minHeight: '44px',
              minWidth: '44px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <>
          <div
            className="mobile-drawer-overlay"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            className="mobile-drawer-content"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Train size={18} style={{ color: '#60a5fa' }} />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>RailExpress Menu</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="btn btn-sm btn-secondary"
                aria-label="Close menu"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile User Profile Header */}
            {user && (
              <div style={{ padding: '10px 12px', background: '#0f172a', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{user.email}</div>
                <span className="badge badge-confirmed" style={{ marginTop: '6px' }}>
                  {user.role}
                </span>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={() => handleNavClick('search')}
                className={`btn ${activePage === 'search' || activePage === 'home' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <Search size={16} /> Search Trains
              </button>

              <button
                onClick={() => handleNavClick('pnr')}
                className={`btn ${activePage === 'pnr' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                <Ticket size={16} /> PNR Status
              </button>

              {user && (
                <button
                  onClick={() => handleNavClick('my-bookings')}
                  className={`btn ${activePage === 'my-bookings' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', width: '100%' }}
                >
                  <Ticket size={16} /> My Bookings
                </button>
              )}

              {user && user.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`btn ${activePage === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    justifyContent: 'flex-start',
                    width: '100%',
                    background: activePage === 'admin' ? 'var(--accent-amber)' : 'rgba(217, 119, 6, 0.15)',
                    color: activePage === 'admin' ? '#fff' : '#fbbf24',
                    borderColor: 'rgba(217, 119, 6, 0.35)'
                  }}
                >
                  <ShieldCheck size={16} /> Admin Panel
                </button>
              )}
            </div>

            {/* Mobile Auth Actions Footer */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="btn btn-danger"
                  style={{ width: '100%' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => { openAuthModal('login'); setMobileOpen(false); }}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    <LogIn size={16} /> Login
                  </button>
                  <button
                    onClick={() => { openAuthModal('register'); setMobileOpen(false); }}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <UserPlus size={16} /> Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Responsive Navigation CSS Media Queries */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
