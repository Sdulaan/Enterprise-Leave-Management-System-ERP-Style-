import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    {
        section: 'Employee', items: [
            { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
            { to: '/apply-leave', icon: '＋', label: 'Apply Leave' },
            { to: '/leave-history', icon: '◷', label: 'Leave History' },
            { to: '/leave-balance', icon: '◑', label: 'Leave Balance' },
        ]
    },
    {
        section: 'Manager', roles: ['Manager', 'HRAdmin'], items: [
            { to: '/team-leaves', icon: '◈', label: 'Team Leaves' },
        ]
    },
    {
        section: 'HR Admin', roles: ['HRAdmin'], items: [
            { to: '/all-leaves', icon: '☰', label: 'All Leaves' },
            { to: '/users', icon: '◉', label: 'Users' },
            { to: '/reports', icon: '◎', label: 'Reports' },
        ]
    },
];

const ROLE_COLORS = {
    Employee: '#6366f1',
    Manager: '#f59e0b',
    HRAdmin: '#10b981',
};

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
    const roleColor = ROLE_COLORS[user?.role] || '#6b7280';

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="app-layout">
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <div className="logo-mark">LM</div>
                    {!collapsed && (
                        <div>
                            <span className="logo-title">LeaveMS</span>
                            <span className="logo-sub">Management</span>
                        </div>
                    )}
                    <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                        {collapsed ? '›' : '‹'}
                    </button>
                </div>

                {/* User card */}
                <div className="user-card">
                    <div className="avatar" style={{ borderColor: roleColor, color: roleColor }}>{initials}</div>
                    {!collapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <span className="user-name">{user?.name || 'User'}</span>
                            <span className="user-role" style={{ color: roleColor }}>{user?.role}</span>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="nav-menu">
                    {NAV.map(({ section, roles, items }) => {
                        if (roles && !roles.includes(user?.role)) return null;
                        const visibleItems = items.filter(item => !item.roles || item.roles.includes(user?.role));
                        if (!visibleItems.length) return null;
                        return (
                            <React.Fragment key={section}>
                                {!collapsed && <span className="nav-section-label">{section}</span>}
                                {visibleItems.map(({ to, icon, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                        title={collapsed ? label : undefined}
                                    >
                                        <span className="nav-icon">{icon}</span>
                                        {!collapsed && <span>{label}</span>}
                                    </NavLink>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
                        <span className="nav-icon">⏻</span>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <main className={`main-content ${collapsed ? 'collapsed' : ''}`} style={{ marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)' }}>
                <div className="content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
}