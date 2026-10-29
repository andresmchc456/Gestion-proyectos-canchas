import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const typeConfig = {
    danger: {
      className: 'alert-danger',
      icon: <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
    },
    success: {
      className: 'alert-success',
      icon: <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
    },
    info: {
      className: 'alert-info',
      icon: <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className={`alert ${config.className} animate-fade-in`}>
      {config.icon}
      <div style={{ flex: 1, fontSize: '0.875rem', lineHeight: 1.4 }}>
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.7,
            padding: '2px',
            lineHeight: 1
          }}
          title="Cerrar"
        >
          &times;
        </button>
      )}
    </div>
  );
}

