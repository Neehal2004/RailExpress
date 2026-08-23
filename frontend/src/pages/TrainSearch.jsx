import React, { useState, useEffect } from 'react';
import { Search, Train, Filter, ArrowLeftRight, AlertCircle, RefreshCw, MapPin, Calendar } from 'lucide-react';
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

  const swapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 16px' }}>
      {/* Search Header Banner */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.01em' }}>
          Train Search & Quota Availability
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Query live schedules across 30 Superfast & Vande Bharat express trains
        </p>
      </div>

      {/* Filter / Search Form Panel */}
      <div className="rail-panel" style={{ padding: 'clamp(16px, 3vw, 24px)', marginBottom: '24px', background: '#EAE3D2', border: '1px solid var(--border-color)' }}>
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
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={13} style={{ color: 'var(--accent-red)', marginRight: '4px' }} /> From Station
              </label>
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={13} style={{ color: '#137333', marginRight: '4px' }} /> To Station
              </label>
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
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <Calendar size={13} style={{ color: 'var(--accent-brass)', marginRight: '4px' }} /> Travel Date
              </label>
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
              <button type="submit" className="btn btn-primary" style={{ flex: 1, minHeight: '44px' }}>
                <Search size={16} /> Search
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ padding: '10px 14px', minHeight: '44px' }}>
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800 }}>
          Available Trains {trains.length > 0 && <span style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="tabular-nums">({trains.length})</span>}
        </h3>
        {source && destination && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing trains from <strong style={{ color: 'var(--text-primary)' }}>{source}</strong> to <strong style={{ color: 'var(--text-primary)' }}>{destination}</strong>
          </span>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 10px auto', color: 'var(--accent-red)' }} />
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Searching live train schedules...</div>
        </div>
      )}

      {error && (
        <div className="rail-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--accent-red)', background: '#FCE8E6', border: '1px solid #FAD2CF' }}>
          <AlertCircle size={28} style={{ margin: '0 auto 10px auto' }} />
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
        <div className="rail-panel" style={{ padding: '40px 20px', textAlign: 'center', background: '#FFFFFF', border: '1px solid var(--border-color)' }}>
          <Train size={44} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800 }}>No Direct Express Trains Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', maxWidth: '420px', margin: '6px auto 16px auto' }}>
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
