import React from 'react';

export default function PageHeader({ title, subtitle, actions }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
                    {title}
                </h1>
                {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{subtitle}</p>}
            </div>
            {actions && <div style={{ display: 'flex', gap: '10px' }}>{actions}</div>}
        </div>
    );
}