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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  People,
  PendingActions,
  CheckCircleOutline,
  EventAvailable,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { leaveService, LeaveRequest } from '../../services/leaveService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from 'recharts';

// Define types for chart data
interface LeaveTypeData {
  name: string;
  value: number;
}

interface MonthlyData {
  month: string;
  requests: number;
  days: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Custom Tooltip Props type
type ValueType = string | number | Array<string | number>;
type NameType = string | number;

// Tab Panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export const ManagerDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveComments, setApproveComments] = useState('');

  const queryClient = useQueryClient();

  // Fetch pending leaves
  const { data: pendingLeaves, isLoading, error } = useQuery<LeaveRequest[]>(
    'teamPendingLeaves',
    leaveService.getTeamPendingLeaves,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  // Approve mutation
  const approveMutation = useMutation(
    ({ id, comments }: { id: number; comments?: string }) =>
      leaveService.approveLeave(id, comments),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teamPendingLeaves');
        setOpenApproveDialog(false);
        setSelectedLeave(null);
        setApproveComments('');
      },
      onError: (error) => {
        console.error('Error approving leave:', error);
        alert('Failed to approve leave. Please try again.');
      },
    }
  );

  // Reject mutation
  const rejectMutation = useMutation(
    ({ id, reason }: { id: number; reason: string }) =>
      leaveService.rejectLeave(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teamPendingLeaves');
        setOpenRejectDialog(false);
        setSelectedLeave(null);
        setRejectReason('');
      },
      onError: (error) => {
        console.error('Error rejecting leave:', error);
        alert('Failed to reject leave. Please try again.');
      },
    }
  );

  const handleApproveClick = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setOpenApproveDialog(true);
  };

  const handleRejectClick = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setOpenRejectDialog(true);
  };

  const handleApproveConfirm = () => {
    if (selectedLeave) {
      approveMutation.mutate({ 
        id: selectedLeave.id, 
        comments: approveComments || undefined 
      });
    }
  };

  const handleRejectConfirm = () => {
    if (selectedLeave && rejectReason.trim()) {
      rejectMutation.mutate({ 
        id: selectedLeave.id, 
        reason: rejectReason 
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate stats
  const stats = {
    pending: pendingLeaves?.length || 0,
    approved: pendingLeaves?.filter(l => l.status === 'Approved').length || 0,
    rejected: pendingLeaves?.filter(l => l.status === 'Rejected').length || 0,
    total: pendingLeaves?.length || 0,
  };

  // Prepare data for charts
  const leaveTypeData: LeaveTypeData[] = pendingLeaves?.reduce((acc: LeaveTypeData[], leave) => {
    const existing = acc.find(item => item.name === leave.leaveType);
    if (existing) {
      existing.value += leave.numberOfDays;
    } else {
      acc.push({ name: leave.leaveType, value: leave.numberOfDays });
    }
    return acc;
  }, []) || [];

  const monthlyData: MonthlyData[] = pendingLeaves?.reduce((acc: MonthlyData[], leave) => {
    const month = new Date(leave.startDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.requests += 1;
      existing.days += leave.numberOfDays;
    } else {
      acc.push({ month, requests: 1, days: leave.numberOfDays });
    }
    return acc;
  }, []) || [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="error">
          Error loading dashboard. Please refresh the page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Manager Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Team Members
                  </Typography>
                  <Typography variant="h4">12</Typography>
                  <Typography variant="caption" color="success.main">
                    ↑ 2 new this month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Requests
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pending}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Need your attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ff9800', width: 56, height: 56 }}>
                  <PendingActions />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Approved This Month
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.approved}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    ↑ 15% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4caf50', width: 56, height: 56 }}>
                  <CheckCircleOutline />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Available Today
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    8
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    4 on leave
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196f3', width: 56, height: 56 }}>
                  <EventAvailable />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Pending Approvals" />
          <Tab label="Team Calendar" />
          <Tab label="Analytics" />
          <Tab label="Team History" />
        </Tabs>

        {/* Pending Approvals Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Pending Leave Requests ({pendingLeaves?.length || 0})
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {pendingLeaves && pendingLeaves.length > 0 ? (
              pendingLeaves.map((leave) => (
                <Grid item xs={12} key={leave.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 1, bgcolor: '#1976d2' }}>
                              {leave.userName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {leave.userName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {leave.leaveType}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="body2" color="textSecondary">
                            Duration
                          </Typography>
                          <Typography variant="body2">
                            {new Date(leave.startDate).toLocaleDateString()} -{' '}
                            {new Date(leave.endDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            {leave.numberOfDays} days
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Typography variant="body2" color="textSecondary">
                            Reason
                          </Typography>
                          <Typography variant="body2" noWrap>
                            {leave.reason}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Typography variant="body2" color="textSecondary">
                            Applied On
                          </Typography>
                          <Typography variant="body2">
                            {new Date(leave.createdAt).toLocaleDateString()}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApproveClick(leave)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleRejectClick(leave)}
                            >
                              Reject
                            </Button>
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    No pending leave requests. Great job staying on top of things!
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Team Calendar Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Team Leave Calendar
          </Typography>
          <Paper sx={{ p: 3, bgcolor: '#fafafa' }}>
            <Grid container spacing={2}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <Grid item xs={12} md={2.4} key={day}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {day}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      No leaves scheduled
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Leave Distribution by Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }: any) => `${name}: ${value} days`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: ValueType, name: NameType) => {
                        return [`${value} days`, name];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Leave Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: ValueType, name: NameType) => {
                        if (name === 'requests') return [value, 'Requests'];
                        if (name === 'days') return [`${value} days`, 'Days'];
                        return [value, name];
                      }}
                    />
                    <Bar dataKey="requests" fill="#8884d8" />
                    <Bar dataKey="days" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Team History Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Team Leave History
          </Typography>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              Team history view coming soon...
            </Typography>
          </Paper>
        </TabPanel>
      </Paper>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Leave Request</DialogTitle>
        <DialogContent>
          {selectedLeave && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Employee:</strong> {selectedLeave.userName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Leave Type:</strong> {selectedLeave.leaveType}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Duration:</strong>{' '}
                {new Date(selectedLeave.startDate).toLocaleDateString()} -{' '}
                {new Date(selectedLeave.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Days:</strong> {selectedLeave.numberOfDays}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Reason:</strong> {selectedLeave.reason}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comments (optional)"
                value={approveComments}
                onChange={(e) => setApproveComments(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApproveConfirm}
            disabled={approveMutation.isLoading}
          >
            {approveMutation.isLoading ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Leave Request</DialogTitle>
        <DialogContent>
          {selectedLeave && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Employee:</strong> {selectedLeave.userName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Leave Type:</strong> {selectedLeave.leaveType}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Duration:</strong>{' '}
                {new Date(selectedLeave.startDate).toLocaleDateString()} -{' '}
                {new Date(selectedLeave.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Please provide a reason for rejection
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Rejection Reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                error={!rejectReason.trim()}
                helperText={!rejectReason.trim() ? 'Reason is required' : ''}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectConfirm}
            disabled={!rejectReason.trim() || rejectMutation.isLoading}
          >
            {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};