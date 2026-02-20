import React from 'react';

const variants = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'transparent' },
    success: { background: 'var(--accent)', color: '#fff', border: 'transparent' },
    danger: { background: 'var(--danger)', color: '#fff', border: 'transparent' },
    ghost: { background: 'var(--surface2)', color: 'var(--text-dim)', border: 'var(--border)' },
};

export default function Button({ children, variant = 'primary', loading, disabled, onClick, type = 'button', style }) {
    const v = variants[variant] || variants.primary;
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                border: `1px solid ${v.border}`, cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: disabled || loading ? 0.6 : 1, transition: 'all 0.2s ease',
                ...v, ...style,
            }}
        >
            {loading && (
                <span style={{
                    width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                }} />
            )}
            {children}
        </button>
    );
}