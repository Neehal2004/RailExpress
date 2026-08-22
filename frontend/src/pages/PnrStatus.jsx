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
    <div style={{ maxWidth: '800px', margin: '24px auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', color: 'var(--text-primary)', fontWeight: 800 }}>Live PNR Status Lookup</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Enter your 10-digit PNR number to check current reservation status & coach seat allocation
        </p>
      </div>

      {/* PNR Search Card */}
      <div className="rail-panel" style={{ padding: 'clamp(20px, 4vw, 28px)', marginBottom: '24px', background: '#FFFFFF' }}>
        <form onSubmit={handleSearchPnr}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>10-Digit Booking PNR Number</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                required
                maxLength={15}
                placeholder="e.g. PNR-849201"
                className="form-input"
                style={{ flex: '1 1 200px', letterSpacing: '0.05em', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                aria-label="10-Digit PNR Number"
              />
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: '1 1 140px', minHeight: '44px' }}>
                {loading ? 'Searching...' : <><Search size={16} /> Check Status</>}
              </button>
            </div>
          </div>
        </form>

        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          💡 Tip: Your PNR is located on your electronic ticket or booking confirmation email.
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rail-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--accent-red)', background: '#FCE8E6', border: '1px solid #FAD2CF' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 10px auto' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>PNR Record Not Found</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{error}</p>
        </div>
      )}

      {/* PNR Result Display */}
      {booking && (
        <div className="rail-panel" style={{ padding: 'clamp(20px, 4vw, 28px)', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>PNR NUMBER</span>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{booking.pnr}</h3>
            </div>
            <span className={`badge ${booking.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <CheckCircle size={14} /> Status: {booking.status}
            </span>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '18px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{booking.trainId?.trainName} (#{booking.trainId?.trainNumber})</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {booking.trainId?.source} → {booking.trainId?.destination}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Travel Date: <strong style={{ color: 'var(--text-primary)' }}>{booking.travelDate}</strong> • Class: <strong style={{ color: 'var(--text-primary)' }}>{booking.classType}</strong>
            </div>
          </div>

          {/* Passenger Seat List */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Passenger Coach & Berth Allocation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {booking.passengers?.map((p, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      ({p.age} yrs, {p.gender})
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.825rem' }}>
                    <span style={{ color: '#137333', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>Seat {p.seatNumber}</span> ({p.berth})
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
