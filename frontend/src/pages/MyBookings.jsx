import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Calendar, Train, Printer, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import TicketView from '../components/TicketView';
import API_BASE from '../config/api';

export default function MyBookings({ onNotification }) {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchUserBookings = (silent = false) => {
    if (!user || !user.token) return;
    if (!silent) setLoading(true);
    setError('');

    fetch(`${API_BASE}/api/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load bookings');
        return res.json();
      })
      .then((data) => {
        const bookingsList = Array.isArray(data) ? data : data.bookings || [];
        setBookings(bookingsList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Bookings fetch error:', err);
        setError(err.message || 'Error loading booking records');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserBookings(false);

    // Auto-poll every 10 seconds for real-time updates across devices
    const timer = setInterval(() => {
      fetchUserBookings(true);
    }, 10000);

    const handleFocus = () => fetchUserBookings(true);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const handleCancelBooking = async (pnr) => {
    if (!window.confirm(`Are you sure you want to cancel ticket PNR: ${pnr}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/bookings/cancel/${pnr}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Cancellation failed');

      if (onNotification) {
        onNotification({
          type: 'success',
          message: `Booking PNR: ${pnr} cancelled. Refund of ₹${data.booking?.refundAmount || data.refundAmount || ''} initiated.`
        });
      }
      fetchUserBookings(true);
    } catch (err) {
      if (onNotification) onNotification({ type: 'error', message: err.message });
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <AlertCircle size={48} className="text-cyan-400" style={{ margin: '0 auto 14px auto' }} />
          <h3>Authentication Required</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>
            Please log in or register to view your travel reservation history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', color: '#fff' }}>My Travel Bookings</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>View active reservations, download E-Tickets, and process ticket cancellations</p>
        </div>
        <button onClick={() => fetchUserBookings(false)} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <Ticket size={32} className="text-cyan-400" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 10px auto' }} />
          <div>Loading reservation history...</div>
        </div>
      )}

      {error && (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#f87171' }}>
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3>No Booking Records Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            You haven't booked any train tickets yet. Search available trains to make your first booking!
          </p>
        </div>
      )}

      {/* Bookings Desktop Table & Mobile Cards */}
      {!loading && !error && bookings.length > 0 && (
        <div>
          {/* Desktop Table View (Hidden on mobile screens <= 768px) */}
          <div className="glass-panel desktop-booking-table" style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.8)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 16px' }}>PNR</th>
                  <th style={{ padding: '14px 16px' }}>Train Details</th>
                  <th style={{ padding: '14px 16px' }}>Journey Date</th>
                  <th style={{ padding: '14px 16px' }}>Passengers</th>
                  <th style={{ padding: '14px 16px' }}>Class & Fare</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{b.pnr}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700 }}>{b.trainId?.trainName || 'Express Train'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        #{b.trainId?.trainNumber} • {b.trainId?.source} → {b.trainId?.destination}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{b.travelDate}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {b.passengers?.map((p, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem' }}>
                          • {p.name} ({p.age}, {p.gender})
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700 }}>₹{b.totalFare}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class: {b.classType}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedTicket(b)}
                          className="btn btn-sm btn-secondary"
                          title="View E-Ticket"
                        >
                          <Printer size={14} /> E-Ticket
                        </button>
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(b.pnr)}
                            className="btn btn-sm btn-danger"
                            title="Cancel Ticket"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Booking Cards View (Shown on screens <= 768px) */}
          <div className="mobile-booking-cards" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {bookings.map((b) => (
              <div key={b._id} className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PNR NUMBER</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{b.pnr}</div>
                  </div>
                  <span className={`badge ${b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                    {b.status}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '10px 0', margin: '10px 0' }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.98rem' }}>{b.trainId?.trainName} (#{b.trainId?.trainNumber})</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {b.trainId?.source} → {b.trainId?.destination}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Travel Date: <strong style={{ color: '#fff' }}>{b.travelDate}</strong> • Class: <strong style={{ color: '#fff' }}>{b.classType}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Passengers:</div>
                  {b.passengers?.map((p, idx) => (
                    <div key={idx}>• {p.name} ({p.age}, {p.gender})</div>
                  ))}
                  <div style={{ marginTop: '8px', fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                    Total Fare: ₹{b.totalFare}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="btn btn-sm btn-secondary"
                    style={{ flex: 1 }}
                  >
                    <Printer size={14} /> E-Ticket
                  </button>
                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(b.pnr)}
                      className="btn btn-sm btn-danger"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E-Ticket View Modal */}
      {selectedTicket && (
        <TicketView
          booking={selectedTicket}
          payment={selectedTicket.paymentId}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Responsive View Switcher Media Query */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-booking-table {
            display: none !important;
          }
          .mobile-booking-cards {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .desktop-booking-table {
            display: block !important;
          }
          .mobile-booking-cards {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
