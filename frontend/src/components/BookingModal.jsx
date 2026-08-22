import React, { useState } from 'react';
import { X, Plus, Trash2, User, Calendar, CreditCard, ArrowRight } from 'lucide-react';

export default function BookingModal({ train, selectedClass, travelDate, onClose, onProceedToPayment }) {
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'Male', berth: 'Lower' }
  ]);
  const [error, setError] = useState('');

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    if (passengers.length >= 4) {
      setError('Maximum 4 passengers allowed per booking');
      return;
    }
    setError('');
    setPassengers([...passengers, { name: '', age: '', gender: 'Male', berth: 'Lower' }]);
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return;
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim() || !passengers[i].age) {
        setError(`Please fill in all details for Passenger ${i + 1}`);
        return;
      }
    }
    setError('');
    const totalFare = selectedClass.fare * passengers.length;
    onProceedToPayment({
      trainId: train._id,
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      source: train.source,
      destination: train.destination,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      travelDate,
      classType: selectedClass.className,
      passengers,
      totalFare
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
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
          <div>
            <h3 id="booking-modal-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>Passenger Reservation Form</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {train.trainName} (#{train.trainNumber}) • Class: <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{selectedClass.className}</span> • Date: {travelDate}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div role="alert" style={{ background: 'var(--status-cancelled-bg)', color: 'var(--accent-red)', border: '1px solid var(--status-cancelled-border)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.825rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {passengers.map((p, index) => (
            <div
              key={index}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                marginBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--accent-brass)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Passenger #{index + 1}
                </span>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    aria-label={`Remove passenger ${index + 1}`}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="form-input"
                    value={p.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Age *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="e.g. 28"
                    className="form-input"
                    value={p.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={p.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Berth Choice</label>
                  <select
                    className="form-select"
                    value={p.berth}
                    onChange={(e) => handlePassengerChange(index, 'berth', e.target.value)}
                  >
                    <option value="Lower">Lower Berth</option>
                    <option value="Middle">Middle Berth</option>
                    <option value="Upper">Upper Berth</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {passengers.length < 4 && (
            <button
              type="button"
              onClick={addPassenger}
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '16px', borderStyle: 'dashed', minHeight: '40px' }}
            >
              <Plus size={15} /> Add Passenger ({passengers.length}/4)
            </button>
          )}

          {/* Pricing Breakdown */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ₹{selectedClass.fare} × {passengers.length} Passenger(s)
              </div>
              <div style={{ fontSize: '0.725rem', color: '#137333', fontWeight: 700 }}>Includes GST & IRCTC reservation fees</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#137333', fontFamily: 'var(--font-mono)' }}>
                ₹{selectedClass.fare * passengers.length}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: '1 1 100px' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: '1 1 180px' }}>
              Proceed to Payment <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
