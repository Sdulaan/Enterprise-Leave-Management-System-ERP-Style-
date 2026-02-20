import React, { useEffect, useState } from 'react';
import { getTeamPendingLeaves, approveLeave, rejectLeave } from '../../api/api';
import { PageHeader, Badge, Modal, Button, Alert, Spinner } from '../../components/common';

export default function TeamLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [modal, setModal] = useState(null);
    const [comments, setComments] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const load = () => {
        setLoading(true);
        getTeamPendingLeaves()
            .then(r => setLeaves(r.data || []))
            .catch(err => setError(err.message))
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
                if (!comments) { setError('Rejection reason required'); setActionLoading(false); return; }
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

    if (loading) return <Spinner />;

    const pending = leaves.filter(l => l.status === 'Pending');

    return (
        <div className="page fade-in">
            <PageHeader title="Team Leave Requests" subtitle={`${pending.length} pending approval`} />
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
            <Alert type="error" message={error} onClose={() => setError('')} />

            {leaves.length === 0 ? (
                <div className="card empty-page">
                    <span className="empty-icon-lg">✓</span>
                    <h3>All caught up!</h3>
                    <p>No pending leave requests from your team.</p>
                </div>
            ) : (
                <div className="team-leave-list">
                    {leaves.map(leave => (
                        <div key={leave.id} className="team-leave-card">
                            <div className="tlc-avatar">{leave.userName?.[0]?.toUpperCase() || '?'}</div>
                            <div className="tlc-info">
                                <span className="tlc-name">{leave.userName}</span>
                                <div className="tlc-meta">
                                    <span className="leave-type-chip">{leave.leaveType}</span>
                                    <span className="tlc-dates">
                                        {new Date(leave.startDate).toLocaleDateString()} → {new Date(leave.endDate).toLocaleDateString()}
                                    </span>
                                    <span className="tlc-days">{leave.numberOfDays} days</span>
                                </div>
                                {leave.reason && <p className="tlc-reason">"{leave.reason}"</p>}
                            </div>
                            <div className="tlc-status">
                                <Badge status={leave.status} />
                                <span className="tlc-submitted">Applied {new Date(leave.createdAt).toLocaleDateString()}</span>
                            </div>
                            {leave.status === 'Pending' && (
                                <div className="tlc-actions">
                                    <button className="tbl-btn approve" onClick={() => { setModal({ type: 'approve', id: leave.id }); setComments(''); }}>✓</button>
                                    <button className="tbl-btn reject" onClick={() => { setModal({ type: 'reject', id: leave.id }); setComments(''); }}>✕</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === 'approve' ? 'Approve Leave' : 'Reject Leave'}>
                <textarea
                    className="form-input form-textarea"
                    placeholder={modal?.type === 'approve' ? 'Optional comments...' : 'Rejection reason (required)...'}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
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