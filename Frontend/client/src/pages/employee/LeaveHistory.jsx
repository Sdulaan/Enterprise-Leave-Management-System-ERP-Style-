import React, { useEffect, useState } from 'react';
import { getLeaveHistory } from '../../api/api';
import { PageHeader, Badge, Spinner, Alert } from '../../components/common';

export default function LeaveHistory() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        getLeaveHistory()
            .then(r => setLeaves(r.data || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];
    const filtered = filter === 'All' ? leaves : leaves.filter(l => l.status === filter);

    return (
        <div className="page fade-in">
            <PageHeader title="Leave History" subtitle={`${filtered.length} records`} />
            <Alert type="error" message={error} onClose={() => setError('')} />

            <div className="toolbar">
                <div className="filter-tabs">
                    {statuses.map(s => (
                        <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                            {s}
                            <span className="filter-count">{s === 'All' ? leaves.length : leaves.filter(l => l.status === s).length}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Days</th>
                            <th>Status</th>
                            <th>Reason</th>
                            <th>Applied</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="table-empty">No records found</td></tr>
                        ) : filtered.map(leave => (
                            <tr key={leave.id}>
                                <td><span className="leave-type-chip">{leave.leaveType}</span></td>
                                <td>{new Date(leave.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                <td><strong>{leave.numberOfDays}</strong></td>
                                <td><Badge status={leave.status} /></td>
                                <td className="text-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leave.reason || '—'}</td>
                                <td className="text-muted">{new Date(leave.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}