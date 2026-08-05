import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Notification({ notification, onClose }) {
  if (!notification) return null;

  const { type = 'info', message } = notification;

  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-400" />,
    error: <AlertCircle size={20} className="text-rose-400" />,
    info: <Info size={20} className="text-cyan-400" />
  };

  const bgStyles = {
    success: 'rgba(16, 185, 129, 0.2)',
    error: 'rgba(239, 68, 68, 0.2)',
    info: 'rgba(6, 182, 212, 0.2)'
  };

  const borderStyles = {
    success: '1px solid rgba(16, 185, 129, 0.4)',
    error: '1px solid rgba(239, 68, 68, 0.4)',
    info: '1px solid rgba(6, 182, 212, 0.4)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '12px',
        background: bgStyles[type] || bgStyles.info,
        border: borderStyles[type] || borderStyles.info,
        backdropFilter: 'blur(10px)',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        maxWidth: '420px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {icons[type]}
      <span style={{ fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
