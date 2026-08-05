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
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Passenger Details</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {train.trainName} ({train.trainNumber}) • Class: <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{selectedClass.className}</span> • Date: {travelDate}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {passengers.map((p, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  Passenger #{index + 1}
                </span>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
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
              style={{ width: '100%', marginBottom: '20px', borderStyle: 'dashed' }}
            >
              <Plus size={16} /> Add Passenger ({passengers.length}/4)
            </button>
          )}

          {/* Pricing Breakdown */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ₹{selectedClass.fare} × {passengers.length} Passenger(s)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#34d399' }}>Includes all taxes & railway reservation fees</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                ₹{selectedClass.fare * passengers.length}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Proceed to Payment <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
