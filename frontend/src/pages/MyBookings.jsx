import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Calendar, Train, Printer, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import TicketView from '../components/TicketView';
import API_BASE from '../config/api';

export default function MyBookings({ onNotification }) {
  const { user, logout } = useContext(AuthContext);
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
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          logout();
          throw new Error('Your session has expired. Please log in again.');
        }
        if (!res.ok) throw new Error(data.message || 'Failed to load bookings');
        return data;
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
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        logout();
        throw new Error('Your session has expired. Please log in again.');
      }
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
        <div className="rail-panel" style={{ padding: '32px' }}>
          <AlertCircle size={44} style={{ color: '#60a5fa', margin: '0 auto 14px auto' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Authentication Required</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.85rem' }}>
            Please log in or register to view your travel reservation history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', color: '#fff', fontWeight: 800 }}>My Travel Bookings</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View active reservations, download E-Tickets, and process ticket cancellations</p>
        </div>
        <button onClick={() => fetchUserBookings(false)} className="btn btn-secondary btn-sm">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 10px auto', color: '#60a5fa' }} />
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Loading reservation history...</div>
        </div>
      )}

      {error && (
        <div className="rail-panel" style={{ padding: '24px', textAlign: 'center', color: '#f87171' }}>
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="rail-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Ticket size={44} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>No Booking Records Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            You haven't booked any train tickets yet. Search available trains to make your first booking!
          </p>
        </div>
      )}

      {/* Bookings Desktop Table & Mobile Cards */}
      {!loading && !error && bookings.length > 0 && (
        <div>
          {/* Desktop Table View */}
          <div className="rail-panel desktop-booking-table" style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table className="rail-table">
              <thead>
                <tr>
                  <th>PNR Number</th>
                  <th>Train Details</th>
                  <th>Journey Date</th>
                  <th>Passengers</th>
                  <th>Class & Fare</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{b.pnr}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{b.trainId?.trainName || 'Express Train'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        #{b.trainId?.trainNumber} • {b.trainId?.source} → {b.trainId?.destination}
                      </div>
                    </td>
                    <td>{b.travelDate}</td>
                    <td>
                      {b.passengers?.map((p, idx) => (
                        <div key={idx} style={{ fontSize: '0.78rem' }}>
                          • {p.name} ({p.age}, {p.gender})
                        </div>
                      ))}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#34d399' }}>₹{b.totalFare}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Class: {b.classType}</div>
                    </td>
                    <td>
                      <span className={`badge ${b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
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

          {/* Mobile Booking Cards View */}
          <div className="mobile-booking-cards" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.map((b) => (
              <div key={b._id} className="rail-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PNR NUMBER</span>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{b.pnr}</div>
                  </div>
                  <span className={`badge ${b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                    {b.status}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '10px 0', margin: '10px 0' }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{b.trainId?.trainName} (#{b.trainId?.trainNumber})</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {b.trainId?.source} → {b.trainId?.destination}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Date: <strong style={{ color: '#fff' }}>{b.travelDate}</strong> • Class: <strong style={{ color: '#fff' }}>{b.classType}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>Passengers:</div>
                  {b.passengers?.map((p, idx) => (
                    <div key={idx}>• {p.name} ({p.age}, {p.gender})</div>
                  ))}
                  <div style={{ marginTop: '6px', fontWeight: 800, color: '#34d399', fontSize: '0.925rem' }}>
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
