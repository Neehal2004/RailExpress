import React, { useState } from 'react';
import { Clock, MapPin, ArrowRight, Shield, CheckCircle } from 'lucide-react';

export default function TrainCard({ train, onSelectBookingClass }) {
  const [selectedClass, setSelectedClass] = useState(train.classes[0]?.className || '3A');

  const currentClassObj = train.classes.find((c) => c.className === selectedClass) || train.classes[0];

  return (
    <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
      {/* Train Header Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '14px',
          marginBottom: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{train.trainName}</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Runs On: {train.runsOn.join(', ')} • {train.distanceKm} km
          </p>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fare starts from</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            ₹{currentClassObj?.fare}
          </div>
        </div>
      </div>

      {/* Train Schedule Timeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(15, 23, 42, 0.5)',
          padding: '14px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '16px'
        }}
      >
        {/* Source */}
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{train.departureTime}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{train.source}</div>
        </div>

        {/* Travel Duration Indicator */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{train.duration}</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: 'var(--text-muted)',
              margin: '2px 0'
            }}
          >
            <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.15)' }} />
            <ArrowRight size={14} color="var(--accent-cyan)" />
            <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Direct</span>
        </div>

        {/* Destination */}
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{train.arrivalTime}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {train.destination}
          </div>
        </div>
      </div>

      {/* Class Selector Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Select Class & Availability:
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
            gap: '8px'
          }}
        >
          {train.classes.map((cls) => {
            const isSelected = selectedClass === cls.className;
            const isAvailable = cls.availableSeats > 0;
            return (
              <div
                key={cls.className}
                onClick={() => setSelectedClass(cls.className)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedClass(cls.className); }}
                aria-pressed={isSelected}
                aria-label={`Select class ${cls.className}, fare ₹${cls.fare}, ${cls.availableSeats} seats available`}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  transition: 'all 0.2s ease',
                  touchAction: 'manipulation'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                    {cls.className}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    ₹{cls.fare}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    marginTop: '4px',
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            onClick={() => onSelectBookingClass(train, currentClassObj)}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '280px' }}
            aria-label={`Book ticket for ${train.trainName} in class ${selectedClass} for ₹${currentClassObj?.fare}`}
          >
            <CheckCircle size={18} /> Book {selectedClass} - ₹{currentClassObj?.fare}
          </button>
        </div>
      </div>
    </div>
  );
}
