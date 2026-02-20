import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import LeaveBalance from './pages/employee/LeaveBalance';
import TeamLeaves from './pages/manager/TeamLeaves';
import AllLeaves from './pages/hr/AllLeaves';
import Users from './pages/hr/Users';
import Reports from './pages/hr/Reports';

function PrivateRoute({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
    return <Layout>{children}</Layout>;
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/apply-leave" element={<PrivateRoute><ApplyLeave /></PrivateRoute>} />
                    <Route path="/leave-history" element={<PrivateRoute><LeaveHistory /></PrivateRoute>} />
                    <Route path="/leave-balance" element={<PrivateRoute><LeaveBalance /></PrivateRoute>} />

                    <Route path="/team-leaves" element={<PrivateRoute roles={['Manager', 'HRAdmin']}><TeamLeaves /></PrivateRoute>} />

                    <Route path="/all-leaves" element={<PrivateRoute roles={['HRAdmin']}><AllLeaves /></PrivateRoute>} />
                    <Route path="/users" element={<PrivateRoute roles={['HRAdmin']}><Users /></PrivateRoute>} />
                    <Route path="/reports" element={<PrivateRoute roles={['HRAdmin']}><Reports /></PrivateRoute>} />

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}