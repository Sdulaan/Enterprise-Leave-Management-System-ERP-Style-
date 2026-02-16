import api from './api';

export interface LeaveRequest {
    id: number;
    userId: string;
    userName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    reason: string;
    status: string;
    comments?: string;
    createdAt: string;
}

export interface ApplyLeaveDto {
    leaveType: number;
    startDate: string;
    endDate: string;
    reason: string;
}

export interface LeaveBalance {
    annualLeave: number;
    sickLeave: number;
    casualLeave: number;
}

export const leaveService = {
    async applyLeave(data: ApplyLeaveDto): Promise<LeaveRequest> {
        const response = await api.post('/leave/apply', data);
        return response.data.data;
    },

    async getLeaveHistory(): Promise<LeaveRequest[]> {
        const response = await api.get('/leave/history');
        return response.data.data;
    },

    async getLeaveBalance(): Promise<LeaveBalance> {
        const response = await api.get('/leave/balance');
        return response.data.data;
    },

    async approveLeave(id: number, comments?: string): Promise<LeaveRequest> {
        const response = await api.post(`/leave/${id}/approve`, comments);
        return response.data.data;
    },

    async rejectLeave(id: number, reason: string): Promise<LeaveRequest> {
        const response = await api.post(`/leave/${id}/reject`, reason);
        return response.data.data;
    },

    async getTeamPendingLeaves(): Promise<LeaveRequest[]> {
        const response = await api.get('/leave/team-pending');
        return response.data.data;
    },
};