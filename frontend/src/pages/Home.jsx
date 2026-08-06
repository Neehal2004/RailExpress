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

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(32px, 5vw, 60px) 16px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.25) 0%, transparent 70%)'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: 'var(--accent-cyan)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '16px',
              maxWidth: '100%'
            }}
          >
            <Zap size={15} /> Fast, Reliable & Secure Railway Reservation
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: '14px',
              background: 'linear-gradient(to right, #ffffff, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Book Your Next Journey Across India with Confidence
          </h1>

          <p style={{ fontSize: 'clamp(0.92rem, 2vw, 1.1rem)', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 28px auto' }}>
            Check real-time train availability, book confirmed tickets in seconds, track PNR status live, and experience instant hassle-free refunds.
          </p>

          {/* Station Search Widget Panel */}
          <div className="glass-panel" style={{ padding: 'clamp(16px, 4vw, 28px)', textAlign: 'left' }}>
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
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
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
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    <Search size={18} /> Search Trains
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            {
              icon: <Train size={28} className="text-cyan-400" />,
              title: 'Live Seat Availability',
              desc: 'Real-time seat tracking for 1A, 2A, 3A, Sleeper (SL), and Chair Car (CC) coaches.'
            },
            {
              icon: <Zap size={28} className="text-blue-400" />,
              title: 'Instant Ticket Booking',
              desc: 'Seamless registration, passenger berth choices, and immediate PNR generation.'
            },
            {
              icon: <RefreshCw size={28} className="text-emerald-400" />,
              title: 'Easy Cancellation & Refund',
              desc: 'Cancel tickets with one click before departure and receive instant refund status.'
            },
            {
              icon: <ShieldCheck size={28} className="text-amber-400" />,
              title: 'Printable E-Tickets',
              desc: 'Generate official print-ready E-Tickets complete with QR code TC verification.'
            }
          ].map((item, index) => (
            <div key={index} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '10px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Trains Section */}
      {featuredTrains.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', color: '#fff' }}>Popular Superfast & Vande Bharat Express Trains</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Top rated daily connections with high seat availability</p>
            </div>
            <button onClick={() => onSearch({ source: '', destination: '', date })} className="btn btn-secondary btn-sm">
              View All Trains <ArrowRight size={16} />
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
