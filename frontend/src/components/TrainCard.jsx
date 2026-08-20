import React, { useState } from 'react';
import { Clock, MapPin, ArrowRight, Shield, CheckCircle } from 'lucide-react';

export default function TrainCard({ train, onSelectBookingClass }) {
  const [selectedClass, setSelectedClass] = useState(train.classes[0]?.className || '3A');

  const currentClassObj = train.classes.find((c) => c.className === selectedClass) || train.classes[0];

  return (
    <div className="rail-card" style={{ padding: '18px 20px', marginBottom: '16px' }}>
      {/* Train Header Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'rgba(37, 99, 235, 0.15)',
                color: '#60a5fa',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 700,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              #{train.trainNumber}
            </span>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>{train.trainName}</h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Runs On: <strong style={{ color: 'var(--text-secondary)' }}>{train.runsOn.join(', ')}</strong> • {train.distanceKm} km
          </p>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Starting Fare</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
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
          background: '#0f172a',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '14px'
        }}
      >
        {/* Source */}
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{train.departureTime}</div>
          <div style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{train.source}</div>
        </div>

        {/* Travel Duration Indicator */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{train.duration}</span>
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
            <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
            <ArrowRight size={14} color="#60a5fa" />
            <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Direct Express</span>
        </div>

        {/* Destination */}
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{train.arrivalTime}</div>
          <div style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {train.destination}
          </div>
        </div>
      </div>

      {/* Class Selector Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Select Class Quota & Seat Availability:
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
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
                className={`quota-box ${isSelected ? 'quota-box-selected' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                    {cls.className}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
                    ₹{cls.fare}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    marginTop: '4px',
                    fontFamily: 'var(--font-mono)',
                    color: isAvailable ? '#34d399' : '#f87171'
                  }}
                >
                  {isAvailable ? `AVL ${cls.availableSeats}` : 'WL / FULL'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={() => onSelectBookingClass(train, currentClassObj)}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '280px' }}
            aria-label={`Book ticket for ${train.trainName} in class ${selectedClass} for ₹${currentClassObj?.fare}`}
          >
            <CheckCircle size={16} /> Book {selectedClass} • ₹{currentClassObj?.fare}
          </button>
        </div>
      </div>
    </div>
  );
}
