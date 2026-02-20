const BASE_URL = 'http://localhost:5062/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (res) => {
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
};

// Auth
export const login = (data) =>
    fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse);

export const register = (data) =>
    fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse);

// Leave
export const applyLeave = (data) =>
    fetch(`${BASE_URL}/leave/apply`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse);

export const getLeaveHistory = () =>
    fetch(`${BASE_URL}/leave/history`, { headers: getHeaders() }).then(handleResponse);

export const getLeaveBalance = () =>
    fetch(`${BASE_URL}/leave/balance`, { headers: getHeaders() }).then(handleResponse);

export const getTeamPendingLeaves = () =>
    fetch(`${BASE_URL}/leave/team-pending`, { headers: getHeaders() }).then(handleResponse);

export const approveLeave = (id, comments) =>
    fetch(`${BASE_URL}/leave/${id}/approve`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(comments) }).then(handleResponse);

export const rejectLeave = (id, reason) =>
    fetch(`${BASE_URL}/leave/${id}/reject`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(reason) }).then(handleResponse);

export const generateReport = async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/leave/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Report generation failed');
    return res.blob();
};

// Users
export const getAllUsers = () =>
    fetch(`${BASE_URL}/users`, { headers: getHeaders() }).then(handleResponse);

export const getUserById = (id) =>
    fetch(`${BASE_URL}/users/${id}`, { headers: getHeaders() }).then(handleResponse);

export const updateUserRole = (id, role) =>
    fetch(`${BASE_URL}/users/${id}/role`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(role) }).then(handleResponse);

export const deactivateUser = (id) =>
    fetch(`${BASE_URL}/users/${id}/deactivate`, { method: 'PUT', headers: getHeaders() }).then(handleResponse);

export const activateUser = (id) =>
    fetch(`${BASE_URL}/users/${id}/activate`, { method: 'PUT', headers: getHeaders() }).then(handleResponse);

export const getAllLeaves = () =>
    fetch('/api/leave/all', { headers: getHeaders() }).then(handleResponse);