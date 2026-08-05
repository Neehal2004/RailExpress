import React, { useState } from 'react';
import { Clock, MapPin, ArrowRight, Shield, CheckCircle } from 'lucide-react';

export default function TrainCard({ train, onSelectBookingClass }) {
  const [selectedClass, setSelectedClass] = useState(train.classes[0]?.className || '3A');

  const currentClassObj = train.classes.find((c) => c.className === selectedClass) || train.classes[0];

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
      {/* Train Header Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
          marginBottom: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              #{train.trainNumber}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{train.trainName}</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Runs On: {train.runsOn.join(', ')} • {train.distanceKm} km
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fare starts from</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            ₹{currentClassObj?.fare}
          </div>
        </div>
      </div>

      {/* Train Schedule Timeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(15, 23, 42, 0.5)',
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px'
        }}
      >
        {/* Source */}
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{train.departureTime}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{train.source}</div>
        </div>

        {/* Travel Duration Indicator */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{train.duration}</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              margin: '4px 0'
            }}
          >
            <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.15)' }} />
            <ArrowRight size={14} color="var(--accent-cyan)" />
            <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Direct</span>
        </div>

        {/* Destination */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{train.arrivalTime}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {train.destination}
          </div>
        </div>
      </div>

      {/* Class Selector Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Select Class & Availability:
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {train.classes.map((cls) => {
            const isSelected = selectedClass === cls.className;
            const isAvailable = cls.availableSeats > 0;
            return (
              <div
                key={cls.className}
                onClick={() => setSelectedClass(cls.className)}
                style={{
                  flex: '1 1 120px',
                  minWidth: '110px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                    {cls.className}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    ₹{cls.fare}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginTop: '6px',
                    color: isAvailable ? '#34d399' : '#f87171'
                  }}
                >
                  {isAvailable ? `AVL ${cls.availableSeats}` : 'WL / Full'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            onClick={() => onSelectBookingClass(train, currentClassObj)}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '240px' }}
          >
            <CheckCircle size={18} /> Book {selectedClass} - ₹{currentClassObj?.fare}
          </button>
        </div>
      </div>
    </div>
  );
}
