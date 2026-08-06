import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Plus, Trash2, Edit3, DollarSign, Ticket, Train, Users, Download, RefreshCw, AlertCircle, X, Radio } from 'lucide-react';
import API_BASE from '../config/api';

export default function AdminDashboard({ onNotification }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('schedules');
  const [stats, setStats] = useState(null);
  const [trains, setTrains] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const fetchAdminData = (silent = false) => {
    if (!user || user.role !== 'admin') return;
    if (!silent) setLoading(true);

    const headers = { Authorization: `Bearer ${user.token}` };

    Promise.all([
      fetch(`${API_BASE}/api/admin/stats`, { headers }).then((res) => res.json()),
      fetch(`${API_BASE}/api/trains`).then((res) => res.json()),
      fetch(`${API_BASE}/api/admin/bookings`, { headers }).then((res) => res.json()),
      fetch(`${API_BASE}/api/admin/payments`, { headers }).then((res) => res.json())
    ])
      .then(([statsData, trainsData, bookingsData, paymentsData]) => {
        if (statsData) setStats(statsData);
        if (trainsData.trains) setTrains(trainsData.trains);
        if (Array.isArray(bookingsData)) setAllBookings(bookingsData);
        if (Array.isArray(paymentsData)) setAllPayments(paymentsData);
        setLastSyncTime(new Date());
        setLoading(false);
      })
      .catch((err) => {
        console.error('Admin fetch error:', err);
        setLoading(false);
      });
  };

  // Real-Time Auto Polling & Focus Sync
  useEffect(() => {
    fetchAdminData(false);

    // Auto-poll every 10 seconds for real-time updates across devices
    const timer = setInterval(() => {
      fetchAdminData(true);
    }, 10000);

    // Refetch immediately when tab gains focus
    const handleFocus = () => fetchAdminData(true);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // Train Modal State
  const [showAddTrainModal, setShowAddTrainModal] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);

  // Train Form State
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('06:00 AM');
  const [arrivalTime, setArrivalTime] = useState('02:00 PM');
  const [duration, setDuration] = useState('8h 00m');
  const [distanceKm, setDistanceKm] = useState(500);

  const handleSaveTrain = async (e) => {
    e.preventDefault();
    const payload = {
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      distanceKm: Number(distanceKm)
    };

    const method = editingTrain ? 'PUT' : 'POST';
    const url = editingTrain ? `${API_BASE}/api/trains/${editingTrain._id}` : `${API_BASE}/api/trains`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to save train');

      if (onNotification) {
        onNotification({
          type: 'success',
          message: editingTrain ? `Train ${trainNumber} updated!` : `Train ${trainNumber} added!`
        });
      }
      setShowAddTrainModal(false);
      setEditingTrain(null);
      resetForm();
      fetchAdminData(true);
    } catch (err) {
      if (onNotification) onNotification({ type: 'error', message: err.message });
    }
  };

  const handleDeleteTrain = async (id, trainNo) => {
    if (!window.confirm(`Are you sure you want to delete Train #${trainNo}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/trains/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete train');

      if (onNotification) onNotification({ type: 'success', message: `Train #${trainNo} deleted` });
      fetchAdminData(true);
    } catch (err) {
      if (onNotification) onNotification({ type: 'error', message: err.message });
    }
  };

  const openEditModal = (t) => {
    setEditingTrain(t);
    setTrainNumber(t.trainNumber);
    setTrainName(t.trainName);
    setSource(t.source);
    setDestination(t.destination);
    setDepartureTime(t.departureTime);
    setArrivalTime(t.arrivalTime);
    setDuration(t.duration);
    setDistanceKm(t.distanceKm);
    setShowAddTrainModal(true);
  };

  const resetForm = () => {
    setTrainNumber('');
    setTrainName('');
    setSource('');
    setDestination('');
    setDepartureTime('06:00 AM');
    setArrivalTime('02:00 PM');
    setDuration('8h 00m');
    setDistanceKm(500);
  };

  const exportReportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats,
      bookingsCount: allBookings.length,
      bookings: allBookings
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rtbs_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <AlertCircle size={48} className="text-rose-400" style={{ margin: '0 auto 16px auto' }} />
          <h2>Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>
            Railway Administrator credentials are required to view this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '24px auto', padding: '0 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#fbbf24" />
            <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', color: '#fff' }}>Railway Admin Control Center</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <Radio size={14} className="text-emerald-400" />
            <span>Live Auto-Sync (Updated {lastSyncTime.toLocaleTimeString()})</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={exportReportJSON} className="btn btn-secondary btn-sm">
            <Download size={16} /> Export JSON Report
          </button>
          <button onClick={() => fetchAdminData(false)} className="btn btn-secondary btn-sm">
            <RefreshCw size={16} /> Sync Now
          </button>
        </div>
      </div>

      {/* Analytics Executive Cards Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>TOTAL REVENUE</span>
              <DollarSign size={20} className="text-emerald-400" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
              ₹{stats.totalRevenue?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Refunded: ₹{stats.totalRefunds?.toLocaleString()}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>TOTAL BOOKINGS</span>
              <Ticket size={20} className="text-cyan-400" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '6px' }}>
              {stats.totalBookings}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Confirmed: {stats.activeBookings} • Cancelled: {stats.cancelledBookings}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>TRAIN SCHEDULES</span>
              <Train size={20} className="text-blue-400" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#60a5fa', marginTop: '6px' }}>
              {stats.totalTrains}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active Superfast Routes</div>
          </div>

          <div className="glass-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>REGISTERED PASSENGERS</span>
              <Users size={20} className="text-amber-400" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active User Accounts</div>
          </div>
        </div>
      )}

      {/* Dashboard Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '4px'
        }}
      >
        {[
          { id: 'schedules', label: 'Train Schedules', icon: <Train size={16} /> },
          { id: 'reports', label: 'Bookings Report', icon: <Ticket size={16} /> },
          { id: 'payments', label: 'Payment Ledger', icon: <DollarSign size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              minHeight: '44px',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              background: 'none',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              touchAction: 'manipulation'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Train Schedule Management */}
      {activeTab === 'schedules' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Train Schedules List</h3>
            <button
              onClick={() => { resetForm(); setEditingTrain(null); setShowAddTrainModal(true); }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} /> Add New Train Schedule
            </button>
          </div>

          <div className="glass-panel table-responsive">
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.8)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Train #</th>
                  <th style={{ padding: '12px' }}>Train Name</th>
                  <th style={{ padding: '12px' }}>Route (Source → Destination)</th>
                  <th style={{ padding: '12px' }}>Timings & Duration</th>
                  <th style={{ padding: '12px' }}>Classes Fares</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--accent-cyan)' }}>#{t.trainNumber}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{t.trainName}</td>
                    <td style={{ padding: '12px' }}>{t.source} → {t.destination} ({t.distanceKm} km)</td>
                    <td style={{ padding: '12px' }}>{t.departureTime} - {t.arrivalTime} ({t.duration})</td>
                    <td style={{ padding: '12px' }}>
                      {t.classes.map((c) => (
                        <span key={c.className} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', marginRight: '4px', fontSize: '0.75rem', display: 'inline-block', marginBottom: '2px' }}>
                          {c.className}: ₹{c.fare} (AVL: {c.availableSeats})
                        </span>
                      ))}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditModal(t)} className="btn btn-sm btn-secondary" title="Edit" aria-label={`Edit ${t.trainName}`}>
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteTrain(t._id, t.trainNumber)} className="btn btn-sm btn-danger" title="Delete" aria-label={`Delete ${t.trainName}`}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bookings Report */}
      {activeTab === 'reports' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '16px' }}>Master Booking Records ({allBookings.length})</h3>
          <div className="glass-panel table-responsive">
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.8)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>PNR</th>
                  <th style={{ padding: '12px' }}>Passenger User</th>
                  <th style={{ padding: '12px' }}>Train</th>
                  <th style={{ padding: '12px' }}>Travel Date</th>
                  <th style={{ padding: '12px' }}>Class & Seats</th>
                  <th style={{ padding: '12px' }}>Total Fare</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{b.pnr}</td>
                    <td style={{ padding: '12px' }}>{b.userId?.name} ({b.userId?.email})</td>
                    <td style={{ padding: '12px' }}>{b.trainId?.trainName} (#{b.trainId?.trainNumber})</td>
                    <td style={{ padding: '12px' }}>{b.travelDate}</td>
                    <td style={{ padding: '12px' }}>{b.classType} ({b.passengers?.length} pax)</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>₹{b.totalFare}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payment Ledger */}
      {activeTab === 'payments' && (
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '16px' }}>Payment Gateway Ledger ({allPayments.length})</h3>
          <div className="glass-panel table-responsive">
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.8)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Txn ID</th>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Method</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {allPayments.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{p.transactionId}</td>
                    <td style={{ padding: '12px' }}>{p.userId?.name}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>₹{p.amount}</td>
                    <td style={{ padding: '12px' }}>{p.paymentMethod}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${p.status === 'Refunded' ? 'badge-warning' : 'badge-confirmed'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      {new Date(p.paymentDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Train Modal */}
      {showAddTrainModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="train-modal-title">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
              <h3 id="train-modal-title" style={{ fontSize: '1.25rem', color: '#fff' }}>
                {editingTrain ? `Edit Train #${editingTrain.trainNumber}` : 'Add New Train Schedule'}
              </h3>
              <button onClick={() => setShowAddTrainModal(false)} className="btn btn-sm btn-secondary" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTrain}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Train Number *</label>
                  <input type="text" required placeholder="e.g. 12004" className="form-input" value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Train Name *</label>
                  <input type="text" required placeholder="e.g. Shatabdi Express" className="form-input" value={trainName} onChange={(e) => setTrainName(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Source Station *</label>
                  <input type="text" required placeholder="e.g. New Delhi (NDLS)" className="form-input" value={source} onChange={(e) => setSource(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination Station *</label>
                  <input type="text" required placeholder="e.g. Jaipur (JP)" className="form-input" value={destination} onChange={(e) => setDestination(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Dep. Time</label>
                  <input type="text" required placeholder="06:00 AM" className="form-input" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Arr. Time</label>
                  <input type="text" required placeholder="10:30 AM" className="form-input" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input type="text" required placeholder="4h 30m" className="form-input" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Distance (KM)</label>
                <input type="number" required placeholder="308" className="form-input" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowAddTrainModal(false)} className="btn btn-secondary" style={{ flex: '1 1 100px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: '1 1 180px' }}>{editingTrain ? 'Save Changes' : 'Create Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
