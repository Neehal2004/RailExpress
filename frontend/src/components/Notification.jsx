import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Notification({ notification, onClose }) {
  if (!notification) return null;

  const { type = 'info', message } = notification;

  const icons = {
    success: <CheckCircle2 size={20} style={{ color: '#137333', flexShrink: 0 }} />,
    error: <AlertCircle size={20} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />,
    info: <Info size={20} style={{ color: 'var(--accent-brass)', flexShrink: 0 }} />
  };

  const bgStyles = {
    success: 'var(--status-confirmed-bg)',
    error: 'var(--status-cancelled-bg)',
    info: 'var(--status-rac-bg)'
  };

  const borderStyles = {
    success: '1px solid var(--status-confirmed-border)',
    error: '1px solid var(--status-cancelled-border)',
    info: '1px solid var(--status-rac-border)'
  };

  const textStyles = {
    success: 'var(--status-confirmed-text)',
    error: 'var(--status-cancelled-text)',
    info: 'var(--status-rac-text)'
  };

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: 'var(--radius-sm)',
        background: bgStyles[type] || bgStyles.info,
        border: borderStyles[type] || borderStyles.info,
        color: textStyles[type] || textStyles.info,
        boxShadow: 'var(--shadow-md)',
        maxWidth: '440px',
        animation: 'fadeIn 0.15s ease'
      }}
    >
      {icons[type]}
      <span style={{ fontSize: '0.875rem', fontWeight: 700, flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
