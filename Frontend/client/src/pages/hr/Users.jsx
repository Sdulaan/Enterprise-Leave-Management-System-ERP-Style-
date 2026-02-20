import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deactivateUser, activateUser } from '../../api/api';
import { PageHeader, Modal, Button, Alert, Spinner } from '../../components/common';

const ROLES = ['Employee', 'Manager', 'HRAdmin'];
const ROLE_COLORS = { Employee: '#6366f1', Manager: '#f59e0b', HRAdmin: '#10b981' };

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [roleModal, setRoleModal] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const load = () => {
        setLoading(true);
        getAllUsers()
            .then(r => setUsers(r.data || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleRoleChange = async () => {
        if (!selectedRole) return;
        setActionLoading(true);
        try {
            await updateUserRole(roleModal.id, selectedRole);
            setSuccess('Role updated successfully');
            setRoleModal(null); load();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggle = async (user) => {
        try {
            if (user.isActive) { await deactivateUser(user.id); setSuccess('User deactivated'); }
            else { await activateUser(user.id); setSuccess('User activated'); }
            load();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <Spinner />;

    const filtered = users.filter(u =>
        !search || u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.department?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page fade-in">
            <PageHeader title="Users" subtitle={`${users.length} total users`} />
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
            <Alert type="error" message={error} onClose={() => setError('')} />

            <div className="toolbar">
                <input className="search-input" placeholder="Search by name, email or department..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="user-grid">
                {filtered.map(user => {
                    const color = ROLE_COLORS[user.role] || '#6b7280';
                    const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
                    return (
                        <div key={user.id} className="user-card-item" style={{ opacity: user.isActive === false ? 0.6 : 1 }}>
                            <div className="ucr-avatar" style={{ borderColor: color, color }}>{initials}</div>
                            <div className="ucr-info">
                                <span className="ucr-name">{user.name}</span>
                                <span className="ucr-email">{user.email}</span>
                                <span className="ucr-code">{user.employeeCode}</span>
                                <span className="ucr-dept">{user.department}</span>
                            </div>
                            <span className="ucr-role-badge" style={{ color, borderColor: color }}>{user.role}</span>
                            {user.isActive === false && (
                                <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, textTransform: 'uppercase' }}>Inactive</span>
                            )}
                            <div className="ucr-actions">
                                <button className="ucr-btn" onClick={() => { setRoleModal({ id: user.id, name: user.name }); setSelectedRole(user.role); }}>
                                    Change Role
                                </button>
                                <button className={`ucr-btn ${user.isActive !== false ? 'deactivate' : 'activate'}`} onClick={() => handleToggle(user)}>
                                    {user.isActive !== false ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal open={!!roleModal} onClose={() => setRoleModal(null)} title={`Change Role — ${roleModal?.name}`}>
                <div className="role-options">
                    {ROLES.map(r => (
                        <button
                            key={r}
                            className={`role-option ${selectedRole === r ? 'selected' : ''}`}
                            style={{ '--rc': ROLE_COLORS[r] }}
                            onClick={() => setSelectedRole(r)}
                        >
                            <span className="role-dot" style={{ background: ROLE_COLORS[r] }} />
                            {r}
                        </button>
                    ))}
                </div>
                <div className="modal-footer" style={{ marginTop: 16 }}>
                    <Button variant="ghost" onClick={() => setRoleModal(null)}>Cancel</Button>
                    <Button loading={actionLoading} onClick={handleRoleChange}>Update Role</Button>
                </div>
            </Modal>
        </div>
    );
}