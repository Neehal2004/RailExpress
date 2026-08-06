import React, { useState } from 'react';
import { Search, Ticket, CheckCircle, AlertCircle, Train, Calendar, User, Printer } from 'lucide-react';
import TicketView from '../components/TicketView';
import API_BASE from '../config/api';

export default function PnrStatus() {
  const [pnrInput, setPnrInput] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const handleSearchPnr = async (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;

    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const res = await fetch(`${API_BASE}/api/bookings/pnr/${pnrInput.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'PNR search failed');
      }

      setBooking(data);
    } catch (err) {
      setError(err.message || 'No booking record found for this PNR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>Live PNR Status Lookup</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Enter your 10-digit booking PNR number to check current reservation & coach status
        </p>
      </div>

      {/* PNR Search Card */}
      <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)', marginBottom: '30px' }}>
        <form onSubmit={handleSearchPnr}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.95rem' }}>10-Digit PNR Number</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="e.g. PNR-849201"
                className="form-input"
                style={{ flex: '1 1 200px', letterSpacing: '0.05em', fontWeight: 700, fontSize: '1.05rem' }}
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                aria-label="10-Digit PNR Number"
              />
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: '1 1 120px' }}>
                {loading ? 'Searching...' : <><Search size={18} /> Check Status</>}
              </button>
            </div>
          </div>
        </form>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          💡 Tip: You can find your PNR on your booking confirmation ticket or SMS notification.
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#f87171' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 10px auto' }} />
          <h3>PNR Not Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{error}</p>
        </div>
      )}

      {/* PNR Result Display */}
      {booking && (
        <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PNR NUMBER</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)' }}>{booking.pnr}</h3>
            </div>
            <span className={`badge ${booking.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              <CheckCircle size={14} /> Status: {booking.status}
            </span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{booking.trainId?.trainName} (#{booking.trainId?.trainNumber})</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {booking.trainId?.source} → {booking.trainId?.destination}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Travel Date: <strong style={{ color: '#fff' }}>{booking.travelDate}</strong> • Class: <strong style={{ color: '#fff' }}>{booking.classType}</strong>
            </div>
          </div>

          {/* Passenger Seat List */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '10px' }}>Passenger Coach & Berth Allocation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {booking.passengers?.map((p, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      ({p.age} yrs, {p.gender})
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>Coach {p.coach || 'B2'}</span> • Seat {p.seatNumber || (index + 12)} ({p.berth})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowTicketModal(true)} className="btn btn-primary" style={{ width: '100%', maxWidth: '240px' }}>
              <Printer size={16} /> View Official E-Ticket
            </button>
          </div>
        </div>
      )}

      {showTicketModal && booking && (
        <TicketView
          booking={booking}
          payment={booking.paymentId}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
}
