import React, { useState } from 'react';
import { Search, Ticket, CheckCircle, AlertCircle, RefreshCw, Printer } from 'lucide-react';
import TicketView from '../components/TicketView';

export default function PnrStatus() {
  const [pnrInput, setPnrInput] = useState('PNR-9823410582');
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const handlePnrSearch = (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;

    setLoading(true);
    setError('');
    setTicketData(null);

    fetch(`/api/bookings/pnr/${pnrInput.trim()}`)
      .then((res) => {
        if (!res.ok) throw new Error('No booking found for this PNR number.');
        return res.json();
      })
      .then((data) => {
        setTicketData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', marginBottom: '30px' }}>
        <Ticket size={40} className="text-cyan-400" style={{ margin: '0 auto 12px auto' }} />
        <h2 style={{ fontSize: '1.75rem', color: '#fff' }}>Check Live PNR Booking Status</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Enter your 10-digit Passenger Name Record (PNR) number to inspect live reservation status and seat assignments.
        </p>

        <form onSubmit={handlePnrSearch} style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              required
              placeholder="Enter PNR Number (e.g. PNR-9823410582)"
              className="form-input"
              style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
              <Search size={18} /> Search
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="animate-spin text-cyan-400" style={{ margin: '0 auto 12px auto' }} />
          <div>Checking PNR status...</div>
        </div>
      )}

      {error && (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 8px auto' }} />
          <div>{error}</div>
        </div>
      )}

      {ticketData && ticketData.booking && (
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PNR NUMBER</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {ticketData.booking.pnr}
              </h3>
            </div>

            <span className={`badge ${ticketData.booking.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>
              {ticketData.booking.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Train Name & Number</div>
              <div style={{ fontWeight: 700, color: '#fff' }}>
                {ticketData.booking.trainId?.trainName} (#{ticketData.booking.trainId?.trainNumber})
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {ticketData.booking.trainId?.source} → {ticketData.booking.trainId?.destination}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Journey Date & Class</div>
              <div style={{ fontWeight: 700, color: '#fff' }}>
                {ticketData.booking.travelDate} ({ticketData.booking.classType})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Booked By</div>
              <div style={{ fontWeight: 700, color: '#fff' }}>
                {ticketData.booking.userId?.name || 'Passenger'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {ticketData.booking.userId?.email}
              </div>
            </div>
          </div>

          {/* Passenger Seating Table */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Passenger List & Seat Allocations</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15,23,42,0.6)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Passenger</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Age / Gender</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Seat / Coach</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Berth Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketData.booking.passengers?.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '10px' }}>{p.age} Yrs / {p.gender}</td>
                      <td style={{ padding: '10px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{p.seatNumber}</td>
                      <td style={{ padding: '10px' }}>{p.berth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowTicketModal(true)} className="btn btn-primary">
              <Printer size={16} /> Open & Print E-Ticket
            </button>
          </div>
        </div>
      )}

      {showTicketModal && ticketData && (
        <TicketView
          booking={ticketData.booking}
          payment={ticketData.payment}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
}
