import React, { useState } from 'react';
import { X, QrCode, CreditCard, Building2, ShieldCheck, CheckCircle, Lock } from 'lucide-react';

export default function PaymentModal({ bookingData, onClose, onConfirmPayment, processing }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('passenger@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [bank, setBank] = useState('State Bank of India');

  const handlePay = (e) => {
    e.preventDefault();
    onConfirmPayment(paymentMethod);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--accent-brass)',
            paddingBottom: '12px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} style={{ color: 'var(--accent-brass)' }} />
            <div>
              <h3 id="payment-modal-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                Payment Gateway Clearance
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Amount Payable: <span style={{ color: '#137333', fontWeight: 800, fontFamily: 'var(--font-mono)' }} className="tabular-nums">₹{bookingData.totalFare}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary" disabled={processing} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Payment Method Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '16px' }}>
          {[
            { id: 'UPI', label: 'UPI / QR', icon: <QrCode size={15} /> },
            { id: 'Card', label: 'Card', icon: <CreditCard size={15} /> },
            { id: 'NetBanking', label: 'Net Banking', icon: <Building2 size={15} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPaymentMethod(tab.id)}
              aria-pressed={paymentMethod === tab.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 4px',
                minHeight: '40px',
                borderRadius: 'var(--radius-sm)',
                background: paymentMethod === tab.id ? 'var(--accent-red)' : '#FFFFFF',
                border: paymentMethod === tab.id ? '1.5px solid var(--accent-red)' : '1px solid var(--border-color)',
                color: paymentMethod === tab.id ? '#ffffff' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                touchAction: 'manipulation'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay}>
          {paymentMethod === 'UPI' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  margin: '0 auto 12px auto',
                  background: '#ffffff',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-charcoal)'
                }}
              >
                {/* Simulated QR Code SVG */}
                <svg viewBox="0 0 100 100" width="75" height="75">
                  <rect x="0" y="0" width="30" height="30" fill="#202321" />
                  <rect x="5" y="5" width="20" height="20" fill="#fff" />
                  <rect x="10" y="10" width="10" height="10" fill="#202321" />
                  <rect x="70" y="0" width="30" height="30" fill="#202321" />
                  <rect x="75" y="5" width="20" height="20" fill="#fff" />
                  <rect x="80" y="10" width="10" height="10" fill="#202321" />
                  <rect x="0" y="70" width="30" height="30" fill="#202321" />
                  <rect x="5" y="75" width="20" height="20" fill="#fff" />
                  <rect x="10" y="80" width="10" height="10" fill="#202321" />
                  <rect x="35" y="35" width="30" height="30" fill="#B52A2A" />
                </svg>
                <span style={{ fontSize: '0.6rem', color: '#202321', fontWeight: 800, marginTop: '2px' }}>SCAN & PAY</span>
              </div>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Or enter UPI VPA ID</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'Card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Debit / Credit Card Number</label>
                <input
                  type="text"
                  required
                  className="form-input tabular-nums"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input type="text" required defaultValue="08/28" className="form-input tabular-nums" />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV / CVC</label>
                  <input type="password" required defaultValue="882" maxLength={4} className="form-input tabular-nums" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'NetBanking' && (
            <div className="form-group">
              <label className="form-label">Select Authorised Bank</label>
              <select className="form-select" value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
              </select>
            </div>
          )}

          {/* Security Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              margin: '12px 0',
              padding: '8px 10px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-color)'
            }}
          >
            <ShieldCheck size={15} style={{ color: '#137333' }} />
            256-Bit SSL Encrypted Railway Reservation Gateway
          </div>

          <button
            type="submit"
            disabled={processing}
            className="btn btn-emerald"
            style={{ width: '100%', minHeight: '44px', fontSize: '0.9rem' }}
          >
            {processing ? (
              <span>Authorizing Transaction...</span>
            ) : (
              <>
                <CheckCircle size={16} /> Pay ₹{bookingData.totalFare} & Issue Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
