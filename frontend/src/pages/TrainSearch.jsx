import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import TrainCard from '../components/TrainCard';

export default function TrainSearch({ initialSearch, onSelectBookingClass }) {
  const [source, setSource] = useState(initialSearch?.source || '');
  const [destination, setDestination] = useState(initialSearch?.destination || '');
  const [date, setDate] = useState(initialSearch?.date || new Date().toISOString().split('T')[0]);
  const [classFilter, setClassFilter] = useState('ALL');
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrains = (src, dest) => {
    setLoading(true);
    let url = '/api/trains';
    const params = new URLSearchParams();
    if (src && src.trim() !== '') params.append('source', src.trim());
    if (dest && dest.trim() !== '') params.append('destination', dest.trim());
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.trains) setTrains(data.trains);
        if (data.stations) setStations(data.stations);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch trains error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (initialSearch) {
      const src = initialSearch.source !== undefined ? initialSearch.source : source;
      const dest = initialSearch.destination !== undefined ? initialSearch.destination : destination;
      const dt = initialSearch.date !== undefined ? initialSearch.date : date;
      setSource(src);
      setDestination(dest);
      setDate(dt);
      fetchTrains(src, dest);
    } else {
      fetchTrains(source, destination);
    }
  }, [initialSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTrains(source, destination);
  };

  const filteredTrains = trains.filter((t) => {
    if (classFilter === 'ALL') return true;
    return t.classes.some((c) => c.className === classFilter);
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      {/* Header & Search Controls */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '16px' }}>Train Search & Seat Availability</h2>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">From Station</label>
              <input
                type="text"
                className="form-input"
                list="station-list"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source station..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">To Station</label>
              <input
                type="text"
                className="form-input"
                list="station-list"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination station..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Travel Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Filter Class</label>
              <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                <option value="ALL">All Classes (1A, 2A, 3A, SL, CC)</option>
                <option value="1A">First AC (1A)</option>
                <option value="2A">2nd AC (2A)</option>
                <option value="3A">3rd AC (3A)</option>
                <option value="SL">Sleeper (SL)</option>
                <option value="CC">AC Chair Car (CC)</option>
              </select>
            </div>

            <div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                <Search size={18} /> Search
              </button>
            </div>
          </div>
        </form>

        <datalist id="station-list">
          {stations.map((s, idx) => (
            <option key={idx} value={s} />
          ))}
        </datalist>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
          Available Trains ({filteredTrains.length})
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing schedules for <strong style={{ color: 'var(--accent-cyan)' }}>{date}</strong>
        </span>
      </div>

      {/* Train List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin text-cyan-400" style={{ margin: '0 auto 12px auto' }} />
          <div>Fetching real-time train schedules...</div>
        </div>
      ) : filteredTrains.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <AlertCircle size={40} className="text-amber-400" style={{ margin: '0 auto 12px auto' }} />
          <h3>No trains found matching your search parameters</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Try clearing the station filters or changing the travel date.
          </p>
          <button onClick={() => { setSource(''); setDestination(''); fetchTrains('', ''); }} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
            View All Available Trains
          </button>
        </div>
      ) : (
        <div>
          {filteredTrains.map((train) => (
            <TrainCard
              key={train._id}
              train={train}
              onSelectBookingClass={(trainObj, classObj) =>
                onSelectBookingClass(trainObj, classObj, date)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
