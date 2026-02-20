import React, { useEffect, useState } from 'react';

export default function Alert({ type = 'info', message, onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const t = setTimeout(() => { setVisible(false); onClose?.(); }, 4000);
            return () => clearTimeout(t);
        }
    }, [message]);

    if (!message || !visible) return null;

    const styles = {
        success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#10b981', icon: '✓' },
        error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#ef4444', icon: '✕' },
        info: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', color: '#6366f1', icon: 'ℹ' },
    };
    const s = styles[type] || styles.info;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
            background: s.bg, border: `1px solid ${s.border}`, color: s.color,
            fontSize: '14px', animation: 'slideUp 0.3s ease',
        }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>{s.icon}</span>
            <span style={{ flex: 1, color: 'var(--text)' }}>{message}</span>
            <button onClick={() => { setVisible(false); onClose?.(); }}
                style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1 }}>×</button>
        </div>
    );
}