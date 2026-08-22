import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Train, ShieldCheck, Zap, RefreshCw, Award, ArrowRight, Activity, Clock } from 'lucide-react';
import TrainCard from '../components/TrainCard';
import API_BASE from '../config/api';

export default function Home({ onSearch, onSelectBookingClass }) {
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [source, setSource] = useState('New Delhi (NDLS)');
  const [destination, setDestination] = useState('Mumbai Central (MMCT)');
  const [date, setDate] = useState(getTomorrowDate());
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

  const setQuickDate = (targetDate) => {
    setDate(targetDate);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(28px, 4vw, 52px) 16px',
          background: 'var(--bg-charcoal)',
          borderBottom: '3px double var(--accent-brass)'
        }}
      >
        <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
          {/* Header Typography */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-xs)',
                background: 'rgba(176, 138, 69, 0.15)',
                border: '1px solid var(--accent-brass)',
                color: 'var(--accent-brass)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '12px'
              }}
            >
              <Zap size={14} /> Official Indian Railways Partner Network
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.85rem, 4.5vw, 2.85rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '10px',
                color: '#ffffff'
              }}
            >
              Indian Railways Ticket Reservation Portal
            </h1>

            <p style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.05rem)', color: '#D6CDBC', maxWidth: '680px', margin: '0 auto' }}>
              Check real-time train timetables across 30 Superfast & Vande Bharat express routes, inspect seat class quotas, and issue confirmed E-Tickets.
            </p>
          </div>

          {/* Station Search Widget Panel */}
          <div className="rail-panel" style={{ padding: 'clamp(18px, 3.5vw, 28px)', background: '#F5F0E6', border: '2px solid var(--accent-brass)', boxShadow: 'var(--shadow-lg)' }}>
            <form onSubmit={handleSearchSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '12px',
                  alignItems: 'end'
                }}
              >
                {/* Source Station */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                    <MapPin size={13} style={{ color: 'var(--accent-red)', marginRight: '4px' }} /> From Station
                  </label>
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
                  <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                    <MapPin size={13} style={{ color: '#137333', marginRight: '4px' }} /> To Station
                  </label>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                      <Calendar size={13} style={{ color: 'var(--accent-brass)', marginRight: '4px' }} /> Travel Date
                    </label>
                  </div>
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
                  <option value="Jaipur (JP)" />
                  <option value="Lucknow Charbagh (LKO)" />
                  <option value="Pune Junction (PUNE)" />
                  <option value="Patna Junction (PNBE)" />
                </datalist>

                {/* Submit Search Button */}
                <div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', minHeight: '44px', fontWeight: 700 }}>
                    <Search size={16} /> Search Trains
                  </button>
                </div>
              </div>
            </form>

            {/* Date Quick Shortcuts & Popular Routes */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              {/* Quick Routes */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Popular Routes:</span>
                {[
                  { label: 'Delhi ⇄ Mumbai', src: 'New Delhi (NDLS)', dest: 'Mumbai Central (MMCT)' },
                  { label: 'Delhi ⇄ Howrah', src: 'New Delhi (NDLS)', dest: 'Howrah (HWH)' },
                  { label: 'Bengaluru ⇄ Chennai', src: 'KSR Bengaluru (SBC)', dest: 'Chennai Central (MAS)' },
                  { label: 'Delhi ⇄ Varanasi', src: 'New Delhi (NDLS)', dest: 'Varanasi (BSB)' },
                  { label: 'Mumbai ⇄ Ahmedabad', src: 'Mumbai Central (MMCT)', dest: 'Ahmedabad (ADI)' }
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

              {/* Quick Date Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setQuickDate(getTomorrowDate())}
                  className={`btn btn-sm ${date === getTomorrowDate() ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.725rem', padding: '4px 8px', minHeight: '28px' }}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(getDayAfterTomorrowDate())}
                  className={`btn btn-sm ${date === getDayAfterTomorrowDate() ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.725rem', padding: '4px 8px', minHeight: '28px' }}
                >
                  Day After
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Metrics Ticker */}
      <section style={{ background: '#EAE3D2', borderBottom: '1px solid var(--border-color)', padding: '12px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Train size={16} style={{ color: 'var(--accent-red)' }} />
            <span><strong style={{ color: 'var(--text-primary)' }}>30</strong> Superfast & Vande Bharat Expresses</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} style={{ color: '#137333' }} />
            <span><strong style={{ color: 'var(--text-primary)' }}>12+</strong> Major Junction Stations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: 'var(--accent-brass)' }} />
            <span><strong style={{ color: 'var(--text-primary)' }}>Atomic</strong> Concurrency-Safe Seat Allocation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-red)' }} />
            <span><strong style={{ color: 'var(--text-primary)' }}>QR Code</strong> TC E-Ticket Verification</span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            {
              icon: <Train size={24} style={{ color: 'var(--accent-red)' }} />,
              title: 'Live Seat Availability',
              desc: 'Real-time quota seat tracking across 1A, 2A, 3A, Sleeper (SL), and Chair Car (CC) coaches.'
            },
            {
              icon: <Zap size={24} style={{ color: '#137333' }} />,
              title: 'Instant Ticket Booking',
              desc: 'Atomic concurrency-safe booking engine with passenger berth preferences.'
            },
            {
              icon: <RefreshCw size={24} style={{ color: 'var(--accent-brass)' }} />,
              title: '1-Click Cancellation',
              desc: 'Cancel tickets instantly before departure with auto seat restocking and refund status.'
            },
            {
              icon: <ShieldCheck size={24} style={{ color: 'var(--accent-red)' }} />,
              title: 'Printable E-Tickets',
              desc: 'Official print-ready E-Tickets complete with QR code TC verification.'
            }
          ].map((item, index) => (
            <div key={index} className="rail-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '4px', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Trains Section */}
      {featuredTrains.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', color: 'var(--text-primary)', fontWeight: 800 }}>Featured Superfast & Vande Bharat Express Trains</h2>
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
