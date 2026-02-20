import React, { useEffect, useState } from 'react';
import { getAllLeaves, approveLeave, rejectLeave } from '../../api/api';
import { PageHeader, Badge, Modal, Button, Alert, Spinner } from '../../components/common';

export default function AllLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [comments, setComments] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const load = () => {
        setLoading(true);
        getAllLeaves()
            .then((res) => setLeaves(res.data || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleAction = async () => {
        setActionLoading(true);
        try {
            if (modal.type === 'approve') {
                await approveLeave(modal.id, comments);
                setSuccess('Leave approved');
            } else {
                if (!comments) { setError('Reason required'); setActionLoading(false); return; }
                await rejectLeave(modal.id, comments);
                setSuccess('Leave rejected');
            }
            setModal(null); setComments(''); load();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];
    const filtered = leaves
        .filter((l) => filter === 'All' || l.status === filter)
        .filter((l) => !search || l.userName?.toLowerCase().includes(search.toLowerCase()) || l.leaveType?.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <Spinner />;

    return (
        <div className="page fade-in">
            <PageHeader title="All Pending Leave Requests" subtitle={`${filtered.length} of ${leaves.length} pending records`} />

            <Alert type="success" message={success} onClose={() => setSuccess('')} />
            <Alert type="error" message={error} onClose={() => setError('')} />

            <div className="toolbar">
                <div className="filter-tabs">
                    {statuses.map((s) => (
                        <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                            {s}
                            <span className="filter-count">{s === 'All' ? leaves.length : leaves.filter(l => l.status === s).length}</span>
                        </button>
                    ))}
                </div>
                <input
                    className="search-input"
                    placeholder="Search by name or type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Days</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={8} className="table-empty">No records found</td></tr>
                        ) : filtered.map((leave) => (
                            <tr key={leave.id}>
                                <td><strong>{leave.userName}</strong></td>
                                <td><span className="leave-type-chip">{leave.leaveType}</span></td>
                                <td>{new Date(leave.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                <td><strong>{leave.numberOfDays}</strong></td>
                                <td><Badge status={leave.status} /></td>
                                <td className="text-muted">{new Date(leave.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {leave.status === 'Pending' && (
                                        <div className="table-actions">
                                            <button className="tbl-btn approve" onClick={() => { setModal({ type: 'approve', id: leave.id }); setComments(''); }}>✓</button>
                                            <button className="tbl-btn reject" onClick={() => { setModal({ type: 'reject', id: leave.id }); setComments(''); }}>✕</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === 'approve' ? 'Approve Leave' : 'Reject Leave'}>
                <textarea
                    className="form-input form-textarea"
                    placeholder={modal?.type === 'approve' ? 'Optional comments...' : 'Rejection reason (required)...'}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                />
                <div className="modal-footer">
                    <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
                    <Button variant={modal?.type === 'approve' ? 'success' : 'danger'} loading={actionLoading} onClick={handleAction}>
                        Confirm
                    </Button>
                </div>
            </Modal>
        </div>
    );
}