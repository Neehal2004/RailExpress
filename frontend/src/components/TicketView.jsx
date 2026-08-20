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
            padding: '14px 20px',
            background: '#0f172a',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Train size={18} style={{ color: '#60a5fa' }} />
            <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 700 }}>Electronic Railway Ticket (E-Ticket)</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} className="btn btn-sm btn-primary">
              <Printer size={15} /> Print Ticket
            </button>
            <button onClick={onClose} className="btn btn-sm btn-secondary">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Printable Ticket Container */}
        <div style={{ padding: '24px', background: '#151e33' }}>
          {/* Header Branding & PNR */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px dashed var(--border-color)',
              paddingBottom: '14px',
              marginBottom: '18px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                Rail<span style={{ color: '#60a5fa' }}>Express</span> E-Ticket
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Indian Railways Reservation System</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PNR Number
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
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
              background: '#0f172a',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  {train.trainName || 'Express Train'} (#{train.trainNumber || 'N/A'})
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
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
                paddingTop: '6px'
              }}
            >
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{train.departureTime || '06:00 AM'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{train.source}</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{train.duration || 'Direct'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <div style={{ width: '30px', height: '1px', background: 'var(--border-color)' }} />
                  <ArrowRight size={14} color="#60a5fa" />
                  <div style={{ width: '30px', height: '1px', background: 'var(--border-color)' }} />
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{train.arrivalTime || '02:00 PM'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{train.destination}</div>
              </div>
            </div>
          </div>

          {/* Passenger Table */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Passenger Details ({booking.passengers?.length || 0})
            </h4>
            <div className="table-responsive">
              <table className="rail-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Age / Gender</th>
                    <th>Coach & Seat</th>
                    <th>Berth</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.passengers?.map((p, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.age} Yrs / {p.gender}</td>
                      <td style={{ color: '#60a5fa', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.seatNumber}</td>
                      <td>{p.berth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & QR Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#0f172a',
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment Summary</div>
              <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 600 }}>
                Total Fare: <span style={{ color: '#34d399', fontWeight: 800 }}>₹{booking.totalFare}</span>
              </div>
              <div style={{ fontSize: '0.725rem', color: '#34d399' }}>
                Status: {payment?.status || (isCancelled ? 'Refunded' : 'Success')} ({payment?.paymentMethod || 'UPI'})
              </div>
            </div>

            {/* QR Verification Barcode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: '#ffffff',
                  padding: '5px',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <QrCode size={38} color="#000" />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', maxWidth: '100px' }}>
                Scan to verify with Railway TC App
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
