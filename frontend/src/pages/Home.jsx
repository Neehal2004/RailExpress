import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Train, ShieldCheck, Zap, RefreshCw, Award, ArrowRight } from 'lucide-react';
import TrainCard from '../components/TrainCard';
import API_BASE from '../config/api';

export default function Home({ onSearch, onSelectBookingClass }) {
  const [source, setSource] = useState('New Delhi (NDLS)');
  const [destination, setDestination] = useState('Mumbai Central (MMCT)');
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [stations, setStations] = useState([]);
  const [featuredTrains, setFeaturedTrains] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/trains`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stations) setStations(data.stations);
        if (data.trains) setFeaturedTrains(data.trains.slice(0, 3));
      })
      .catch((err) => console.error('Fetch trains error:', err));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ source, destination, date });
  };

  const swapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const selectQuickRoute = (src, dest) => {
    setSource(src);
    setDestination(dest);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(28px, 4vw, 48px) 16px',
          background: 'linear-gradient(180deg, #152238 0%, #0b1120 100%)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-xs)',
                background: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px'
              }}
            >
              <Zap size={14} /> Official Indian Railways Partner Network
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '10px',
                color: '#ffffff'
              }}
            >
              Indian Railways Ticket Reservation Portal
            </h1>

            <p style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.05rem)', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
              Check live train schedules across 30 Superfast & Vande Bharat express routes, view seat availability, and book confirmed E-Tickets instantly.
            </p>
          </div>

          {/* Station Search Widget Panel */}
          <div className="rail-panel" style={{ padding: 'clamp(16px, 3vw, 24px)', background: '#151e33' }}>
            <form onSubmit={handleSearchSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '12px',
                  alignItems: 'end'
                }}
              >
                {/* Source Station */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">From Station</label>
                  <input
                    type="text"
                    className="form-input"
                    list="station-list"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. New Delhi (NDLS)"
                    aria-label="From Station"
                  />
                </div>

                {/* Swap Station Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                  <button
                    type="button"
                    onClick={swapStations}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 'var(--radius-xs)', width: '42px', height: '42px', padding: 0 }}
                    title="Swap stations"
                    aria-label="Swap source and destination stations"
                  >
                    ⇄
                  </button>
                </div>

                {/* Destination Station */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">To Station</label>
                  <input
                    type="text"
                    className="form-input"
                    list="station-list"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Mumbai Central (MMCT)"
                    aria-label="To Station"
                  />
                </div>

                {/* Travel Date */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Travel Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    aria-label="Travel Date"
                  />
                </div>

                <datalist id="station-list">
                  {stations.map((s, idx) => (
                    <option key={idx} value={s} />
                  ))}
                  <option value="New Delhi (NDLS)" />
                  <option value="Mumbai Central (MMCT)" />
                  <option value="Howrah (HWH)" />
                  <option value="KSR Bengaluru (SBC)" />
                  <option value="Chennai Central (MAS)" />
                  <option value="Bhopal (BPL)" />
                  <option value="Varanasi (BSB)" />
                  <option value="Ahmedabad (ADI)" />
                </datalist>

                {/* Submit Search */}
                <div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', minHeight: '44px' }}>
                    <Search size={16} /> Search Trains
                  </button>
                </div>
              </div>
            </form>

            {/* Popular Route Shortcuts */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Quick Routes:</span>
              {[
                { label: 'Delhi ⇄ Mumbai', src: 'New Delhi (NDLS)', dest: 'Mumbai Central (MMCT)' },
                { label: 'Delhi ⇄ Howrah', src: 'New Delhi (NDLS)', dest: 'Howrah (HWH)' },
                { label: 'Bengaluru ⇄ Chennai', src: 'KSR Bengaluru (SBC)', dest: 'Chennai Central (MAS)' },
                { label: 'Delhi ⇄ Varanasi', src: 'New Delhi (NDLS)', dest: 'Varanasi (BSB)' }
              ].map((route, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectQuickRoute(route.src, route.dest)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 10px', minHeight: '30px' }}
                >
                  {route.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            {
              icon: <Train size={24} style={{ color: '#60a5fa' }} />,
              title: 'Live Seat Availability',
              desc: 'Real-time quota seat tracking across 1A, 2A, 3A, Sleeper (SL), and Chair Car (CC).'
            },
            {
              icon: <Zap size={24} style={{ color: '#34d399' }} />,
              title: 'Instant Ticket Booking',
              desc: 'Atomic concurrency-safe booking engine with passenger berth preferences.'
            },
            {
              icon: <RefreshCw size={24} style={{ color: '#fbbf24' }} />,
              title: '1-Click Cancellation',
              desc: 'Cancel tickets instantly before departure with auto seat restocking and refund status.'
            },
            {
              icon: <ShieldCheck size={24} style={{ color: '#a78bfa' }} />,
              title: 'Printable E-Tickets',
              desc: 'Official print-ready E-Tickets complete with QR code TC verification.'
            }
          ].map((item, index) => (
            <div key={index} className="rail-card" style={{ padding: '18px' }}>
              <div style={{ marginBottom: '10px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '4px', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Trains Section */}
      {featuredTrains.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', color: '#fff', fontWeight: 800 }}>Featured Superfast & Vande Bharat Express Trains</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top daily express connections across major junction routes</p>
            </div>
            <button onClick={() => onSearch({ source: '', destination: '', date })} className="btn btn-secondary btn-sm">
              View All 30 Trains <ArrowRight size={15} />
            </button>
          </div>

          <div>
            {featuredTrains.map((train) => (
              <TrainCard
                key={train._id}
                train={train}
                onSelectBookingClass={(trainObj, classObj) =>
                  onSelectBookingClass(trainObj, classObj, date)
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
