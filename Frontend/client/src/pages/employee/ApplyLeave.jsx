import React, { useState, useEffect } from 'react';
import { applyLeave, getLeaveBalance } from '../../api/api';
import { PageHeader, Alert, Button } from '../../components/common';

const LEAVE_TYPES = [
    { label: 'Annual', value: 1 },
    { label: 'Sick', value: 2 },
    { label: 'Casual', value: 3 },
    { label: 'Maternity', value: 4 },
    { label: 'Paternity', value: 5 },
    { label: 'Unpaid', value: 6 },
];

function calcDays(start, end) {
    if (!start || !end) return 0;
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
    return Math.max(0, diff + 1);
}

export default function ApplyLeave() {
    const [form, setForm] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        getLeaveBalance().then(r => setBalance(r.data)).catch(() => { });
    }, []);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
    const days = calcDays(form.startDate, form.endDate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.leaveType || !form.startDate || !form.endDate || !form.reason) {
            setError('All fields are required'); return;
        }
        setLoading(true); setError('');
        try {
            await applyLeave({ ...form, leaveType: Number(form.leaveType), numberOfDays: days });
            setSuccess('Leave application submitted successfully!');
            setForm({ leaveType: '', startDate: '', endDate: '', reason: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page fade-in">
            <PageHeader title="Apply for Leave" subtitle="Submit a new leave request" />
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
            <Alert type="error" message={error} onClose={() => setError('')} />

            <div className="form-page-layout">
                <div>
                    <form className="card apply-form-card" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Leave Type</label>
                            <select className="form-input" value={form.leaveType} onChange={set('leaveType')} required>
                                <option value="">Select leave type</option>
                                {LEAVE_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label} Leave</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <input className="form-input" type="date" value={form.startDate} onChange={set('startDate')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">End Date</label>
                                <input className="form-input" type="date" value={form.endDate} min={form.startDate} onChange={set('endDate')} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Reason</label>
                            <textarea className="form-input form-textarea" rows={4} value={form.reason} onChange={set('reason')} placeholder="Briefly describe the reason for leave..." required />
                        </div>
                        <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
                            Submit Application
                        </Button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="card days-preview">
                        {days > 0 ? (
                            <div className="days-display">
                                <span className="days-number">{days}</span>
                                <span className="days-label">{days === 1 ? 'day' : 'days'} selected</span>
                                <div className="days-range">
                                    <span>{form.startDate}</span>
                                    <span>→</span>
                                    <span>{form.endDate}</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Select dates to preview duration</div>
                        )}
                    </div>

                    <div className="card policy-card">
                        <div className="policy-title">Leave Policy</div>
                        <ul className="policy-list">
                            <li>Annual leave requires 2 weeks advance notice</li>
                            <li>Sick leave should be applied ASAP</li>
                            <li>Leave exceeding 5 days requires manager approval</li>
                            <li>Carry-over limits apply per policy</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}