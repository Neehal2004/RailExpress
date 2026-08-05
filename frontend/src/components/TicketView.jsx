import React from 'react';
import { X, Printer, Train, ShieldCheck, QrCode, Calendar, ArrowRight, UserCheck } from 'lucide-react';

export default function TicketView({ booking, payment, onClose }) {
  if (!booking) return null;

  const train = booking.trainId || {};
  const isCancelled = booking.status === 'Cancelled';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content printable-ticket" style={{ maxWidth: '680px', padding: '0', overflow: 'hidden' }}>
        {/* Modal Top Bar (Hidden in print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            background: 'rgba(15, 23, 42, 0.9)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Train size={20} className="text-cyan-400" />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Electronic Railway Ticket (E-Ticket)</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} className="btn btn-sm btn-primary">
              <Printer size={16} /> Print Ticket
            </button>
            <button onClick={onClose} className="btn btn-sm btn-secondary">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Ticket Container */}
        <div style={{ padding: '24px', background: '#0b132b' }}>
          {/* Header Branding & PNR */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px dashed var(--border-color)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Rail<span style={{ color: 'var(--accent-cyan)' }}>Express</span> E-Ticket
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Indian Railways Reservation Portal</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PNR Number
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                {booking.pnr}
              </div>
              <span className={`badge ${isCancelled ? 'badge-cancelled' : 'badge-confirmed'}`} style={{ marginTop: '4px' }}>
                {booking.status}
              </span>
            </div>
          </div>

          {/* Train Schedule Information */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  {train.trainName || 'Express Train'} (#{train.trainNumber || 'N/A'})
                </span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Class: <strong style={{ color: '#fff' }}>{booking.classType}</strong> • Travel Date: <strong style={{ color: '#fff' }}>{booking.travelDate}</strong>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '16px',
                paddingTop: '8px'
              }}
            >
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{train.departureTime || '06:00 AM'}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{train.source}</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{train.duration || 'Direct'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <div style={{ width: '40px', height: '2px', background: 'var(--border-color)' }} />
                  <ArrowRight size={14} color="var(--accent-cyan)" />
                  <div style={{ width: '40px', height: '2px', background: 'var(--border-color)' }} />
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{train.arrivalTime || '02:00 PM'}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{train.destination}</div>
              </div>
            </div>
          </div>

          {/* Passenger Table */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Passenger Details ({booking.passengers?.length || 0})
            </h4>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem',
                textAlign: 'left'
              }}
            >
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>#</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>Age / Gender</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>Seat / Coach</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>Berth</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers?.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff' }}>
                    <td style={{ padding: '10px' }}>{idx + 1}</td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '10px' }}>{p.age} Yrs / {p.gender}</td>
                    <td style={{ padding: '10px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{p.seatNumber}</td>
                    <td style={{ padding: '10px' }}>{p.berth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment & QR Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Info</div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                Total Fare: <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>₹{booking.totalFare}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399' }}>
                Status: {payment?.status || (isCancelled ? 'Refunded' : 'Success')} ({payment?.paymentMethod || 'UPI'})
              </div>
            </div>

            {/* QR Verification Barcode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: '#fff',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <QrCode size={40} color="#000" />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '100px' }}>
                Scan to verify ticket validity with Railway TC App
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
