import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    {
        section: 'Employee', items: [
            { to: '/dashboard', icon: 'DB', label: 'Dashboard' },
            { to: '/apply-leave', icon: '+', label: 'Apply Leave' },
            { to: '/leave-history', icon: 'H', label: 'Leave History' },
            { to: '/leave-balance', icon: 'B', label: 'Leave Balance' },
        ]
    },
    {
        section: 'Manager', roles: ['Manager', 'HRAdmin'], items: [
            { to: '/team-leaves', icon: 'T', label: 'Team Leaves' },
        ]
    },
    {
        section: 'HR Admin', roles: ['HRAdmin'], items: [
            { to: '/all-leaves', icon: 'A', label: 'All Leaves' },
            { to: '/users', icon: 'U', label: 'Users' },
            { to: '/reports', icon: 'R', label: 'Reports' },
        ]
    },
];

const ROLE_COLORS = {
    Employee: '#6366f1',
    Manager: '#f59e0b',
    HRAdmin: '#10b981',
};

const THEME_KEY = 'leavems-theme';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const navigate = useNavigate();

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
    const roleColor = ROLE_COLORS[user?.role] || '#6b7280';

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const handleLogout = () => { logout(); navigate('/login'); };
    const toggleTheme = () => setTheme(current => (current === 'dark' ? 'light' : 'dark'));

    return (
        <div className="app-layout">
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-mark">LM</div>
                    {!collapsed && (
                        <div>
                            <span className="logo-title">LeaveMS</span>
                            <span className="logo-sub">Management</span>
                        </div>
                    )}
                    <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                        {collapsed ? '>' : '<'}
                    </button>
                </div>

                <div className="user-card">
                    <div className="avatar" style={{ borderColor: roleColor, color: roleColor }}>{initials}</div>
                    {!collapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <span className="user-name">{user?.name || 'User'}</span>
                            <span className="user-role" style={{ color: roleColor }}>{user?.role}</span>
                        </div>
                    )}
                </div>

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

                <div className="sidebar-footer">
                    <button
                        className="theme-btn"
                        onClick={toggleTheme}
                        title={collapsed ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : undefined}
                    >
                        <span className="nav-icon">{theme === 'dark' ? '☀' : '☾'}</span>
                        {!collapsed && <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>}
                    </button>
                    <button className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
                        <span className="nav-icon">X</span>
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
