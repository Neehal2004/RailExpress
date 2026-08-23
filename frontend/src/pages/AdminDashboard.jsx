import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Plus, Trash2, Edit3, DollarSign, Ticket, Train, Users, Download, RefreshCw, AlertCircle, X, Radio } from 'lucide-react';
import API_BASE from '../config/api';

export default function AdminDashboard({ onNotification }) {
  const { user, logout } = useContext(AuthContext);
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
      fetch(`${API_BASE}/api/admin/stats`, { headers }).then(async (res) => {
        if (res.status === 401) { logout(); throw new Error('Session expired'); }
        return res.json();
      }),
      fetch(`${API_BASE}/api/trains`).then((res) => res.json()),
      fetch(`${API_BASE}/api/admin/bookings`, { headers }).then(async (res) => {
        if (res.status === 401) { logout(); throw new Error('Session expired'); }
        return res.json();
      }),
      fetch(`${API_BASE}/api/admin/payments`, { headers }).then(async (res) => {
        if (res.status === 401) { logout(); throw new Error('Session expired'); }
        return res.json();
      })
    ])
      .then(([statsData, trainsData, bookingsData, paymentsData]) => {
        if (statsData) setStats(statsData);
        if (trainsData?.trains) setTrains(trainsData.trains);
        else if (Array.isArray(trainsData)) setTrains(trainsData);
        if (Array.isArray(bookingsData)) setAllBookings(bookingsData);
        else if (bookingsData?.bookings) setAllBookings(bookingsData.bookings);
        if (Array.isArray(paymentsData)) setAllPayments(paymentsData);
        else if (paymentsData?.payments) setAllPayments(paymentsData.payments);
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
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <div className="rail-panel" style={{ padding: '32px', background: '#FFFFFF' }}>
          <AlertCircle size={44} style={{ color: 'var(--accent-red)', margin: '0 auto 14px auto' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800 }}>Access Restricted</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.85rem' }}>
            Railway Administrator credentials are required to view this control center.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '20px auto', padding: '0 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--accent-brass)" />
            <h2 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', color: 'var(--text-primary)', fontWeight: 800 }}>Railway Admin Control Center</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <Radio size={14} style={{ color: '#137333' }} />
            <span>Live Auto-Sync (Updated {lastSyncTime.toLocaleTimeString()})</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={exportReportJSON} className="btn btn-secondary btn-sm">
            <Download size={15} /> Export JSON Report
          </button>
          <button onClick={() => fetchAdminData(false)} className="btn btn-secondary btn-sm">
            <RefreshCw size={15} /> Sync Now
          </button>
        </div>
      </div>

      {/* Analytics Executive Cards Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div className="rail-card" style={{ padding: '16px', background: '#FFFFFF', borderTop: '3px solid #137333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>TOTAL REVENUE</span>
              <DollarSign size={18} style={{ color: '#137333' }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#137333', marginTop: '4px', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
              ₹{stats.totalRevenue?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Refunded: <span className="tabular-nums">₹{stats.totalRefunds?.toLocaleString()}</span>
            </div>
          </div>

          <div className="rail-card" style={{ padding: '16px', background: '#FFFFFF', borderTop: '3px solid var(--accent-red)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>TOTAL BOOKINGS</span>
              <Ticket size={18} style={{ color: 'var(--accent-red)' }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: '4px', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
              {stats.totalBookings}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Confirmed: <span className="tabular-nums">{stats.activeBookings}</span> • Cancelled: <span className="tabular-nums">{stats.cancelledBookings}</span>
            </div>
          </div>

          <div className="rail-card" style={{ padding: '16px', background: '#FFFFFF', borderTop: '3px solid var(--accent-brass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>TRAIN SCHEDULES</span>
              <Train size={18} style={{ color: 'var(--accent-brass)' }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-brass)', marginTop: '4px', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
              {stats.totalTrains}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active Superfast Routes</div>
          </div>

          <div className="rail-card" style={{ padding: '16px', background: '#FFFFFF', borderTop: '3px solid var(--bg-charcoal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>REGISTERED USERS</span>
              <Users size={18} style={{ color: 'var(--text-primary)' }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }} className="tabular-nums">
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active Passenger Accounts</div>
          </div>
        </div>
      )}

      {/* Dashboard Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '2px solid var(--border-color)',
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '2px'
        }}
      >
        {[
          { id: 'schedules', label: 'Train Schedules', icon: <Train size={15} /> },
          { id: 'reports', label: 'Bookings Report', icon: <Ticket size={15} /> },
          { id: 'payments', label: 'Payment Ledger', icon: <DollarSign size={15} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              minHeight: '40px',
              borderBottom: activeTab === tab.id ? '3px solid var(--accent-red)' : '3px solid transparent',
              background: 'none',
              color: activeTab === tab.id ? 'var(--accent-red)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.85rem',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800 }}>Train Schedules List</h3>
            <button
              onClick={() => { resetForm(); setEditingTrain(null); setShowAddTrainModal(true); }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} /> Add New Schedule
            </button>
          </div>

          <div className="rail-panel table-responsive">
            <table className="rail-table" style={{ minWidth: '700px' }}>
              <thead>
                <tr>
                  <th>Train #</th>
                  <th>Train Name</th>
                  <th>Route & Distance</th>
                  <th>Timings & Duration</th>
                  <th>Classes & Availability</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((t) => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 800, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="tabular-nums">#{t.trainNumber}</td>
                    <td style={{ fontWeight: 700 }}>{t.trainName}</td>
                    <td>{t.source} → {t.destination} (<span className="tabular-nums">{t.distanceKm}</span> km)</td>
                    <td><span className="tabular-nums">{t.departureTime}</span> - <span className="tabular-nums">{t.arrivalTime}</span> (<span className="tabular-nums">{t.duration}</span>)</td>
                    <td>
                      {t.classes.map((c) => (
                        <span key={c.className} style={{ background: '#F8F5EE', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', marginRight: '4px', fontSize: '0.725rem', display: 'inline-block', marginBottom: '2px' }}>
                          {c.className}: ₹<span className="tabular-nums">{c.fare}</span> (AVL: <span className="tabular-nums">{c.availableSeats}</span>)
                        </span>
                      ))}
                    </td>
                    <td style={{ textAlign: 'right' }}>
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
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '14px', fontWeight: 800 }}>Master Booking Records (<span className="tabular-nums">{allBookings.length}</span>)</h3>
          <div className="rail-panel table-responsive">
            <table className="rail-table" style={{ minWidth: '700px' }}>
              <thead>
                <tr>
                  <th>PNR</th>
                  <th>Passenger User</th>
                  <th>Train</th>
                  <th>Travel Date</th>
                  <th>Class & Seats</th>
                  <th>Total Fare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 800, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="tabular-nums">{b.pnr}</td>
                    <td>{b.userId?.name} ({b.userId?.email})</td>
                    <td>{b.trainId?.trainName} (#{b.trainId?.trainNumber})</td>
                    <td className="tabular-nums">{b.travelDate}</td>
                    <td>{b.classType} (<span className="tabular-nums">{b.passengers?.length}</span> pax)</td>
                    <td style={{ fontWeight: 700, color: '#137333', fontFamily: 'var(--font-mono)' }} className="tabular-nums">₹{b.totalFare}</td>
                    <td>
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
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '14px', fontWeight: 800 }}>Payment Gateway Ledger (<span className="tabular-nums">{allPayments.length}</span>)</h3>
          <div className="rail-panel table-responsive">
            <table className="rail-table" style={{ minWidth: '700px' }}>
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allPayments.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="tabular-nums">{p.transactionId}</td>
                    <td>{p.userId?.name}</td>
                    <td style={{ fontWeight: 700, color: '#137333', fontFamily: 'var(--font-mono)' }} className="tabular-nums">₹{p.amount}</td>
                    <td>{p.paymentMethod}</td>
                    <td>
                      <span className={`badge ${p.status === 'Refunded' ? 'badge-warning' : 'badge-confirmed'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }} className="tabular-nums">
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--accent-brass)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 id="train-modal-title" style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                {editingTrain ? `Edit Train #${editingTrain.trainNumber}` : 'Add New Train Schedule'}
              </h3>
              <button onClick={() => setShowAddTrainModal(false)} className="btn btn-sm btn-secondary" aria-label="Close modal">
                <X size={16} />
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', flexWrap: 'wrap' }}>
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
