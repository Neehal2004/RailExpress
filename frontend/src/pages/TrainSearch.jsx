import React, { useState, useEffect } from 'react';
import { Search, Train, Filter, ArrowLeftRight, AlertCircle } from 'lucide-react';
import TrainCard from '../components/TrainCard';
import API_BASE from '../config/api';

export default function TrainSearch({ initialSearch, onSelectBookingClass }) {
  const [source, setSource] = useState(initialSearch?.source || '');
  const [destination, setDestination] = useState(initialSearch?.destination || '');
  const [date, setDate] = useState(initialSearch?.date || new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrains = (srcQuery, destQuery) => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (srcQuery) params.append('source', srcQuery);
    if (destQuery) params.append('destination', destQuery);

    fetch(`${API_BASE}/api/trains?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch trains');
        return res.json();
      })
      .then((data) => {
        if (data.trains) setTrains(data.trains);
        if (data.stations) setStations(data.stations);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch trains error:', err);
        setError(err.message || 'Error loading train schedules');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrains(initialSearch?.source || '', initialSearch?.destination || '');
  }, [initialSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTrains(source, destination);
  };

  const handleReset = () => {
    setSource('');
    setDestination('');
    fetchTrains('', '');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
      {/* Search Header Banner */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', color: '#fff' }}>Train Search & Live Seat Availability</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Find onward and return train schedules between any two stations across India</p>
      </div>

      {/* Filter / Search Form Panel */}
      <div className="glass-panel" style={{ padding: 'clamp(16px, 3vw, 24px)', marginBottom: '28px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              alignItems: 'end'
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">From Station</label>
              <input
                type="text"
                className="form-input"
                list="search-station-list"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. New Delhi (NDLS)"
                aria-label="From Station"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">To Station</label>
              <input
                type="text"
                className="form-input"
                list="search-station-list"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Mumbai Central (MMCT)"
                aria-label="To Station"
              />
            </div>

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

            <datalist id="search-station-list">
              {stations.map((s, i) => (
                <option key={i} value={s} />
              ))}
            </datalist>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Search size={16} /> Search
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ padding: '10px 14px' }}>
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>
          Available Trains {trains.length > 0 && <span style={{ color: 'var(--accent-cyan)' }}>({trains.length})</span>}
        </h3>
        {source && destination && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing trains from <strong style={{ color: '#fff' }}>{source}</strong> to <strong style={{ color: '#fff' }}>{destination}</strong>
          </span>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <Train size={32} className="text-cyan-400" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 10px auto' }} />
          <div>Searching live train schedules...</div>
        </div>
      )}

      {error && (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#f87171' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 10px auto' }} />
          <div>{error}</div>
        </div>
      )}

      {/* Results List */}
      {!loading && !error && trains.length > 0 && (
        <div>
          {trains.map((t) => (
            <TrainCard
              key={t._id}
              train={t}
              onSelectBookingClass={(trainObj, classObj) =>
                onSelectBookingClass(trainObj, classObj, date)
              }
            />
          ))}
        </div>
      )}

      {!loading && !error && trains.length === 0 && (
        <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Train size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3>No Direct Trains Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px', maxWidth: '400px', margin: '6px auto 16px auto' }}>
            No direct trains matching your station query were found. Try selecting major junction stations or reset your search filters.
          </p>
          <button onClick={handleReset} className="btn btn-primary btn-sm">
            Reset Filters & View All Trains
          </button>
        </div>
      )}
    </div>
  );
}
