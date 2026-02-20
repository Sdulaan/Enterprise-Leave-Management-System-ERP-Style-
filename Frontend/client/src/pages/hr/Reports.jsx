import React, { useState } from 'react';
import { generateReport } from '../../api/api';
import { PageHeader, Alert, Button } from '../../components/common';

export default function Reports() {
    const [form, setForm] = useState({ startDate: '', endDate: '', department: '', format: 'pdf' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!form.startDate || !form.endDate) { setError('Please select a date range'); return; }
        setLoading(true); setError('');
        try {
            const blob = await generateReport(form);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leave-report-${form.startDate}-to-${form.endDate}.${form.format}`;
            a.click();
            URL.revokeObjectURL(url);
            setSuccess('Report downloaded successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales'];

    return (
        <div className="page fade-in">
            <PageHeader title="Generate Reports" subtitle="Export leave data for any date range" />
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
            <Alert type="error" message={error} onClose={() => setError('')} />

            <div style={{ maxWidth: 560 }}>
                <form className="card" style={{ padding: 28 }} onSubmit={handleGenerate}>
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
                        <label className="form-label">Department</label>
                        <select className="form-input" value={form.department} onChange={set('department')}>
                            {DEPARTMENTS.map(d => <option key={d} value={d === 'All' ? '' : d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Format</label>
                        <div className="format-toggle">
                            {['pdf', 'xlsx', 'csv'].map(f => (
                                <button key={f} type="button" className={`format-btn ${form.format === f ? 'active' : ''}`} onClick={() => setForm(prev => ({ ...prev, format: f }))}>
                                    {f.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 8 }}>
                        ⬇ Generate & Download
                    </Button>
                </form>
            </div>
        </div>
    );
}