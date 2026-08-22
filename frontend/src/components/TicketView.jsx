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
      <div className="modal-content printable-ticket" style={{ maxWidth: '680px', padding: '0', overflow: 'hidden', border: '2px solid var(--bg-charcoal)' }}>
        {/* Modal Top Bar (Hidden in print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            background: 'var(--bg-charcoal)',
            borderBottom: '2px solid var(--accent-brass)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Train size={18} style={{ color: 'var(--accent-brass)' }} />
            <h3 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>Electronic Railway Ticket (E-Ticket)</h3>
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
        <div style={{ padding: '24px', background: '#F5F0E6' }}>
          {/* Header Branding & PNR */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px dashed var(--bg-charcoal)',
              paddingBottom: '14px',
              marginBottom: '18px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Rail<span style={{ color: 'var(--accent-red)' }}>Express</span> Boarding Pass
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Indian Railways Official Reservation Slip</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                PNR Number
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
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
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {train.trainName || 'Express Train'} (#{train.trainNumber || 'N/A'})
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Class: <strong style={{ color: 'var(--text-primary)' }}>{booking.classType}</strong> • Travel Date: <strong style={{ color: 'var(--text-primary)' }}>{booking.travelDate}</strong>
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
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{train.departureTime || '06:00 AM'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{train.source}</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{train.duration || 'Direct'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <div style={{ width: '30px', height: '1px', background: 'var(--border-color)' }} />
                  <ArrowRight size={14} color="var(--accent-red)" />
                  <div style={{ width: '30px', height: '1px', background: 'var(--border-color)' }} />
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{train.arrivalTime || '02:00 PM'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{train.destination}</div>
              </div>
            </div>
          </div>

          {/* Passenger Table */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
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
                      <td style={{ fontWeight: 700 }}>{p.name}</td>
                      <td>{p.age} Yrs / {p.gender}</td>
                      <td style={{ color: 'var(--accent-red)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{p.seatNumber}</td>
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
              background: '#FFFFFF',
              padding: '14px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Payment Summary</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Total Fare: <span style={{ color: '#137333', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>₹{booking.totalFare}</span>
              </div>
              <div style={{ fontSize: '0.725rem', color: '#137333', fontWeight: 700 }}>
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
                  border: '1px solid var(--bg-charcoal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <QrCode size={38} color="#202321" />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', maxWidth: '100px', fontWeight: 600 }}>
                Scan to verify with Railway TC App
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
