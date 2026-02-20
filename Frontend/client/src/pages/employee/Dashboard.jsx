import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeaveBalance, getLeaveHistory } from '../../api/api';
import { PageHeader, Badge, Spinner } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const [balance, setBalance] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getLeaveBalance(), getLeaveHistory()])
            .then(([b, h]) => { setBalance(b.data); setHistory((h.data || []).slice(0, 5)); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="page fade-in">
            <PageHeader
                title={`${greeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`}
                subtitle="Here's your leave overview"
            />

            {/* Stats */}
            <div className="stats-grid">
                {balance && Object.entries(balance).map(([type, data]) => (
                    <div key={type} className="stat-card">
                        <div className="stat-card-top">
                            <span className="stat-label">{type}</span>
                        </div>
                        <div className="stat-value">{data.remaining ?? data.available ?? 0}</div>
                        <div className="stat-sub">of {data.total ?? 0} days remaining</div>
                        <div className="stat-bar-track">
                            <div className="stat-bar-fill" style={{ width: `${Math.min(100, ((data.remaining ?? 0) / (data.total || 1)) * 100)}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions + Recent */}
            <div className="dashboard-grid" style={{ marginTop: 28 }}>
                <div>
                    <h2 className="section-title">Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Link to="/apply-leave" className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                            <span style={{ fontSize: 22 }}>＋</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>Apply for Leave</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Submit a new leave request</div>
                            </div>
                        </Link>
                        <Link to="/leave-history" className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                            <span style={{ fontSize: 22 }}>◷</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>Leave History</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>View all past requests</div>
                            </div>
                        </Link>
                        <Link to="/leave-balance" className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                            <span style={{ fontSize: 22 }}>◑</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>Leave Balance</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Check available entitlements</div>
                            </div>
                        </Link>
                    </div>
                </div>

                <div>
                    <h2 className="section-title">Recent Requests</h2>
                    {history.length === 0 ? (
                        <div className="card empty-state">
                            <span className="empty-icon">📋</span>
                            No recent requests
                        </div>
                    ) : (
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {history.map((item, i) => (
                                <div key={item.id} style={{
                                    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
                                    borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.leaveType}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                                            {new Date(item.startDate).toLocaleDateString()} — {new Date(item.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Badge status={item.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}