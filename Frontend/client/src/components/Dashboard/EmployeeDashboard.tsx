import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Chip,
} from '@mui/material';
import {
    EventAvailable,
    PendingActions,
    CheckCircle,
    Cancel,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { leaveService, LeaveRequest } from '../../services/leaveService';
import { LeaveRequestModal } from './LeaveRequestModal';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export const EmployeeDashboard: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);

    const { data: leaveHistory, refetch: refetchHistory } = useQuery(
        'leaveHistory',
        leaveService.getLeaveHistory
    );

    const { data: leaveBalance } = useQuery(
        'leaveBalance',
        leaveService.getLeaveBalance
    );

    const stats = {
        pending: leaveHistory?.filter(l => l.status === 'Pending').length || 0,
        approved: leaveHistory?.filter(l => l.status === 'Approved').length || 0,
        rejected: leaveHistory?.filter(l => l.status === 'Rejected').length || 0,
        total: leaveHistory?.length || 0,
    };

    const chartData = leaveHistory?.reduce((acc: any[], leave) => {
        const month = new Date(leave.startDate).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
            existing[leave.leaveType] = (existing[leave.leaveType] || 0) + leave.numberOfDays;
        } else {
            acc.push({ month, [leave.leaveType]: leave.numberOfDays });
        }
        return acc;
    }, []) || [];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Employee Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <EventAvailable color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary" gutterBottom>
                                    Annual Leave
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {leaveBalance?.annualLeave || 0} days
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PendingActions color="warning" sx={{ mr: 1 }} />
                                <Typography color="textSecondary" gutterBottom>
                                    Pending Requests
                                </Typography>
                            </Box>
                            <Typography variant="h4">{stats.pending}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckCircle color="success" sx={{ mr: 1 }} />
                                <Typography color="textSecondary" gutterBottom>
                                    Approved
                                </Typography>
                            </Box>
                            <Typography variant="h4">{stats.approved}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Cancel color="error" sx={{ mr: 1 }} />
                                <Typography color="textSecondary" gutterBottom>
                                    Rejected
                                </Typography>
                            </Box>
                            <Typography variant="h4">{stats.rejected}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Action Button */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => setOpenModal(true)}
                        sx={{ mb: 3 }}
                    >
                        Apply for Leave
                    </Button>
                </Grid>

                {/* Leave Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Leave Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="Annual" fill="#8884d8" />
                                <Bar dataKey="Sick" fill="#82ca9d" />
                                <Bar dataKey="Casual" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Recent Leave Requests */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Leave Requests
                        </Typography>
                        <Box>
                            {leaveHistory?.slice(0, 5).map((leave) => (
                                <Box
                                    key={leave.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        py: 1,
                                        borderBottom: '1px solid #eee',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body1">
                                            {leave.leaveType} Leave
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(leave.startDate).toLocaleDateString()} -{' '}
                                            {new Date(leave.endDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={leave.status}
                                        color={
                                            leave.status === 'Approved'
                                                ? 'success'
                                                : leave.status === 'Rejected'
                                                    ? 'error'
                                                    : 'warning'
                                        }
                                        size="small"
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <LeaveRequestModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={() => {
                    setOpenModal(false);
                    refetchHistory();
                }}
            />
        </Box>
    );
};