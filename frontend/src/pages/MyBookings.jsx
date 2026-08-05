import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Printer, XCircle, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import TicketView from '../components/TicketView';

export default function MyBookings({ onNotification }) {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingPNR, setCancellingPNR] = useState(null);

  const fetchBookings = () => {
    if (!user || !user.token) return;
    setLoading(true);
    fetch('/api/bookings/my-bookings', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
        if (data.payments) setPayments(data.payments);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch bookings error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (pnr) => {
    if (!window.confirm(`Are you sure you want to cancel PNR: ${pnr}? Seats will be released and refund initiated.`)) {
      return;
    }

    setCancellingPNR(pnr);
    try {
      const res = await fetch(`/api/bookings/cancel/${pnr}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      if (onNotification) {
        onNotification({
          type: 'success',
          message: `Ticket PNR ${pnr} cancelled! Refund of ₹${data.refundAmount} initiated.`
        });
      }
      fetchBookings();
    } catch (err) {
      if (onNotification) {
        onNotification({ type: 'error', message: err.message });
      }
    } finally {
      setCancellingPNR(null);
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <AlertCircle size={48} className="text-amber-400" style={{ margin: '0 auto 16px auto' }} />
          <h2>Please Log In to View Your Bookings</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            You can log in as passenger to manage tickets and view booking history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: '#fff' }}>My Ticket Bookings & History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage reservations, print E-Tickets, or request refunds</p>
        </div>
        <button onClick={fetchBookings} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin text-cyan-400" style={{ margin: '0 auto 12px auto' }} />
          <div>Loading your travel history...</div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <Ticket size={48} className="text-cyan-400" style={{ margin: '0 auto 16px auto' }} />
          <h3>No Bookings Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>You haven't booked any railway tickets yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((b) => {
            const train = b.trainId || {};
            const payment = payments.find((p) => p.bookingId === b._id);
            const isCancelled = b.status === 'Cancelled';

            return (
              <div key={b._id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PNR Number</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{b.pnr}</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span>
                    <div>
                      <span className={`badge ${isCancelled ? 'badge-cancelled' : 'badge-confirmed'}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>
                      {train.trainName} (#{train.trainNumber})
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {train.source} → {train.destination}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Travel Date & Class</div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>
                      {b.travelDate} • <span style={{ color: 'var(--accent-cyan)' }}>{b.classType}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Passengers & Fare</div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>
                      {b.passengers.length} Passenger(s) • ₹{b.totalFare}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => setSelectedTicket({ booking: b, payment })}
                    className="btn btn-sm btn-primary"
                  >
                    <Printer size={16} /> View E-Ticket
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelBooking(b.pnr)}
                      disabled={cancellingPNR === b.pnr}
                      className="btn btn-sm btn-danger"
                    >
                      <XCircle size={16} /> {cancellingPNR === b.pnr ? 'Cancelling...' : 'Cancel Ticket'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTicket && (
        <TicketView
          booking={selectedTicket.booking}
          payment={selectedTicket.payment}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
