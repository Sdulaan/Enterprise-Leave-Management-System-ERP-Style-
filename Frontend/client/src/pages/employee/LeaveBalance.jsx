import React, { useEffect, useState } from 'react';
import { getLeaveBalance } from '../../api/api';
import { PageHeader, Spinner, Alert } from '../../components/common';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export default function LeaveBalance() {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getLeaveBalance()
            .then(r => setBalance(r.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const entries = balance ? Object.entries(balance) : [];

    return (
        <div className="page fade-in">
            <PageHeader title="Leave Balance" subtitle="Your current entitlement overview" />
            <Alert type="error" message={error} onClose={() => setError('')} />

            {/* Ring summary */}
            <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <div className="balance-rings">
                    {entries.map(([type, data], i) => {
                        const used = (data.total || 0) - (data.remaining ?? data.available ?? 0);
                        const pct = Math.min(100, (used / (data.total || 1)) * 100);
                        const color = COLORS[i % COLORS.length];
                        const r = 28; const circ = 2 * Math.PI * r;
                        return (
                            <div key={type} className="balance-ring-item">
                                <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="40" cy="40" r={r} fill="none" stroke="var(--surface2)" strokeWidth="6" />
                                    <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
                                        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                                        strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
                                </svg>
                                <div className="ring-label">{type}</div>
                                <div className="ring-value" style={{ color }}>{data.remaining ?? data.available ?? 0}</div>
                                <div className="ring-total">of {data.total ?? 0}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail cards */}
            <div className="balance-cards">
                {entries.map(([type, data], i) => {
                    const color = COLORS[i % COLORS.length];
                    const used = (data.total || 0) - (data.remaining ?? data.available ?? 0);
                    const pct = Math.min(100, (used / (data.total || 1)) * 100);
                    return (
                        <div key={type} className="card balance-detail-card">
                            <div className="balance-card-header" style={{ borderColor: color }}>
                                <h3>{type} Leave</h3>
                                <span className="balance-total" style={{ color }}>{data.remaining ?? data.available ?? 0} days</span>
                            </div>
                            <div className="balance-bar-track">
                                <div className="balance-bar-fill" style={{ width: `${pct}%`, background: color }} />
                            </div>
                            <div className="balance-meta">
                                <span>{used} used</span>
                                <span>{data.total ?? 0} total</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}