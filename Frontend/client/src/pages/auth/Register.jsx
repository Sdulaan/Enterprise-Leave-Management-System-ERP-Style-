import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/api';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales'];

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', department: '', employeeCode: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await registerApi(form);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-orb orb1" />
                <div className="auth-orb orb2" />
            </div>
            <div className="auth-card auth-card-wide">
                <div className="auth-logo">
                    <div className="auth-logo-mark">LM</div>
                    <div>
                        <div className="auth-brand">LeaveMS</div>
                        <div className="auth-brand-sub">Create Account</div>
                    </div>
                </div>
                <div className="auth-divider" />

                {error && (
                    <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" value={form.name} onChange={set('name')} placeholder="Jane Smith" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Employee Code</label>
                            <input className="form-input" value={form.employeeCode} onChange={set('employeeCode')} placeholder="EMP001" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select className="form-input" value={form.department} onChange={set('department')} required>
                                <option value="">Select department</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                </div>
            </div>
        </div>
    );
}