import React, { useState } from 'react';
import { Clock, MapPin, ArrowRight, Shield, CheckCircle, Train as TrainIcon } from 'lucide-react';

export default function TrainCard({ train, onSelectBookingClass }) {
  const [selectedClass, setSelectedClass] = useState(train.classes[0]?.className || '3A');

  const currentClassObj = train.classes.find((c) => c.className === selectedClass) || train.classes[0];

  return (
    <div className="rail-card" style={{ padding: '18px 20px', marginBottom: '16px', background: '#FFFFFF', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-brass)' }}>
      {/* Train Header Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
          marginBottom: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'var(--bg-charcoal)',
                color: 'var(--accent-brass)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 700,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              #{train.trainNumber}
            </span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.01em' }}>
              {train.trainName}
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Runs On: <strong style={{ color: 'var(--text-secondary)' }}>{train.runsOn.join(', ')}</strong> • <span className="tabular-nums">{train.distanceKm}</span> km
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Starting Tariff</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#137333', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
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
          background: 'var(--bg-surface)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          marginBottom: '14px'
        }}
      >
        {/* Source */}
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
            {train.departureTime}
          </div>
          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }}>
            {train.source}
          </div>
        </div>

        {/* Travel Duration Indicator */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--accent-red)', fontWeight: 800, fontFamily: 'var(--font-mono)' }} className="tabular-nums">
            {train.duration}
          </span>
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
            <ArrowRight size={14} color="var(--accent-red)" />
            <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Direct Express
          </span>
        </div>

        {/* Destination */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
            {train.arrivalTime}
          </div>
          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }}>
            {train.destination}
          </div>
        </div>
      </div>

      {/* Class Selector Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {cls.className}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#137333', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
                    ₹{cls.fare}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    marginTop: '4px',
                    fontFamily: 'var(--font-mono)',
                    color: isAvailable ? '#137333' : 'var(--accent-red)'
                  }}
                  className="tabular-nums"
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
            style={{ width: '100%', maxWidth: '300px' }}
            aria-label={`Book ticket for ${train.trainName} in class ${selectedClass} for ₹${currentClassObj?.fare}`}
          >
            <CheckCircle size={16} /> Book {selectedClass} • ₹{currentClassObj?.fare}
          </button>
        </div>
      </div>
    </div>
  );
}
