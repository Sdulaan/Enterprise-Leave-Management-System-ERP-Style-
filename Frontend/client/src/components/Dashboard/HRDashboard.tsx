import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Tabs,
    Tab,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    Download,
    Add,
    People,
    Event,
    TrendingUp,
    Assessment,
    Settings,
    PersonAdd,
    Refresh,
    Print,
    Email,
    PieChart as PieChartIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { leaveService } from '../../services/leaveService';
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
    LineChart,
    Line,
} from 'recharts';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export const HRDashboard: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
    const [openLeaveTypeDialog, setOpenLeaveTypeDialog] = useState(false);
    const [reportFilters, setReportFilters] = useState({
        startDate: '',
        endDate: '',
        department: '',
        status: '',
        format: 'PDF',
    });

    const { data: leaveHistory } = useQuery(
        'allLeaveHistory',
        leaveService.getLeaveHistory
    );

    // Mock data for HR dashboard
    const employeeStats = {
        total: 156,
        active: 148,
        onLeave: 12,
        newHires: 8,
        departments: 7,
    };

    const departmentData = [
        { name: 'Engineering', employees: 45, leaveDays: 120 },
        { name: 'Sales', employees: 32, leaveDays: 95 },
        { name: 'Marketing', employees: 28, leaveDays: 78 },
        { name: 'HR', employees: 15, leaveDays: 42 },
        { name: 'Finance', employees: 20, leaveDays: 38 },
        { name: 'Operations', employees: 16, leaveDays: 45 },
    ];

    const leaveTrendData = [
        { month: 'Jan', approved: 45, pending: 12, rejected: 5 },
        { month: 'Feb', approved: 52, pending: 15, rejected: 7 },
        { month: 'Mar', approved: 48, pending: 10, rejected: 4 },
        { month: 'Apr', approved: 61, pending: 18, rejected: 9 },
        { month: 'May', approved: 55, pending: 14, rejected: 6 },
        { month: 'Jun', approved: 67, pending: 20, rejected: 8 },
    ];

    const leaveTypeConfig = [
        { type: 'Annual', defaultDays: 20, carryForward: true, maxCarry: 5 },
        { type: 'Sick', defaultDays: 12, carryForward: false, maxCarry: 0 },
        { type: 'Casual', defaultDays: 10, carryForward: false, maxCarry: 0 },
        { type: 'Maternity', defaultDays: 90, carryForward: false, maxCarry: 0 },
        { type: 'Paternity', defaultDays: 15, carryForward: false, maxCarry: 0 },
        { type: 'Unpaid', defaultDays: 0, carryForward: false, maxCarry: 0 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

    const handleGenerateReport = async () => {
        console.log('Generating report with filters:', reportFilters);
        // Implement report generation API call here
    };

    const handleExportData = () => {
        console.log('Exporting data...');
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    HR Admin Dashboard
                </Typography>
                <Box>
                    <Button variant="outlined" startIcon={<Refresh />} sx={{ mr: 1 }}>
                        Refresh
                    </Button>
                    <Button variant="contained" startIcon={<Print />}>
                        Print Report
                    </Button>
                </Box>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Employees
                                    </Typography>
                                    <Typography variant="h4">{employeeStats.total}</Typography>
                                    <Typography variant="caption" color="success.main">
                                        ↑ {employeeStats.newHires} new this month
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
                                        Active Employees
                                    </Typography>
                                    <Typography variant="h4">{employeeStats.active}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        94% of workforce
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#4caf50', width: 56, height: 56 }}>
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
                                        On Leave Today
                                    </Typography>
                                    <Typography variant="h4" color="warning.main">
                                        {employeeStats.onLeave}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        8% of workforce
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#ff9800', width: 56, height: 56 }}>
                                    <Event />
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
                                        Departments
                                    </Typography>
                                    <Typography variant="h4">{employeeStats.departments}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Across organization
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#9c27b0', width: 56, height: 56 }}>
                                    <Assessment />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content with Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                    <Tab label="Overview" />
                    <Tab label="Employee Management" />
                    <Tab label="Leave Configuration" />
                    <Tab label="Reports" />
                    <Tab label="Analytics" />
                </Tabs>

                {/* Overview Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Department Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={departmentData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry: any) => `${entry.name}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="employees"
                                        >
                                            {departmentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Leave Trends 2026
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={leaveTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="approved" stroke="#4caf50" />
                                        <Line type="monotone" dataKey="pending" stroke="#ff9800" />
                                        <Line type="monotone" dataKey="rejected" stroke="#f44336" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Department Leave Summary
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Department</TableCell>
                                                <TableCell align="right">Employees</TableCell>
                                                <TableCell align="right">Total Leave Days</TableCell>
                                                <TableCell align="right">Avg per Employee</TableCell>
                                                <TableCell align="right">Utilization Rate</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {departmentData.map((dept) => (
                                                <TableRow key={dept.name}>
                                                    <TableCell>{dept.name}</TableCell>
                                                    <TableCell align="right">{dept.employees}</TableCell>
                                                    <TableCell align="right">{dept.leaveDays}</TableCell>
                                                    <TableCell align="right">
                                                        {(dept.leaveDays / dept.employees).toFixed(1)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Chip
                                                            label={`${((dept.leaveDays / (dept.employees * 20)) * 100).toFixed(1)}%`}
                                                            color={dept.leaveDays / dept.employees > 15 ? 'warning' : 'success'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Employee Management Tab */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Employee Directory</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={() => setOpenEmployeeDialog(true)}
                        >
                            Add Employee
                        </Button>
                    </Box>

                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Employee</TableCell>
                                        <TableCell>Department</TableCell>
                                        <TableCell>Leave Balance</TableCell>
                                        <TableCell>Manager</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Sample employee row */}
                                    <TableRow>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ mr: 1, bgcolor: '#1976d2' }}>JD</Avatar>
                                                <Box>
                                                    <Typography variant="body2">John Doe</Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        john.doe@company.com
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>Engineering</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">Annual: 15 days</Typography>
                                            <Typography variant="body2">Sick: 8 days</Typography>
                                        </TableCell>
                                        <TableCell>Jane Smith</TableCell>
                                        <TableCell>
                                            <Chip label="Active" color="success" size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="small">Edit</Button>
                                            <Button size="small" color="error">Deactivate</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </TabPanel>

                {/* Leave Configuration Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Leave Type Configuration</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenLeaveTypeDialog(true)}
                        >
                            Add Leave Type
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {leaveTypeConfig.map((type) => (
                            <Grid item xs={12} md={6} key={type.type}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6">{type.type} Leave</Typography>
                                            <Chip label="Active" color="success" size="small" />
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Default Days
                                                </Typography>
                                                <Typography variant="h6">{type.defaultDays}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Carry Forward
                                                </Typography>
                                                <Typography variant="h6">
                                                    {type.carryForward ? `Yes (Max ${type.maxCarry})` : 'No'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 2 }}>
                                            <Button size="small" sx={{ mr: 1 }}>Edit</Button>
                                            <Button size="small" color="error">Disable</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* Reports Tab */}
                <TabPanel value={tabValue} index={3}>
                    <Typography variant="h6" gutterBottom>
                        Generate Reports
                    </Typography>

                    <Paper sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Start Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={reportFilters.startDate}
                                    onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="End Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={reportFilters.endDate}
                                    onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                                />
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Department"
                                    value={reportFilters.department}
                                    onChange={(e) => setReportFilters({ ...reportFilters, department: e.target.value })}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="1">Engineering</MenuItem>
                                    <MenuItem value="2">HR</MenuItem>
                                    <MenuItem value="3">Sales</MenuItem>
                                    <MenuItem value="4">Marketing</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    value={reportFilters.status}
                                    onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="1">Pending</MenuItem>
                                    <MenuItem value="2">Approved</MenuItem>
                                    <MenuItem value="3">Rejected</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Format"
                                    value={reportFilters.format}
                                    onChange={(e) => setReportFilters({ ...reportFilters, format: e.target.value })}
                                >
                                    <MenuItem value="PDF">PDF</MenuItem>
                                    <MenuItem value="EXCEL">Excel</MenuItem>
                                    <MenuItem value="CSV">CSV</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<Download />}
                                onClick={handleGenerateReport}
                            >
                                Generate Report
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Email />}
                                onClick={handleGenerateReport}
                            >
                                Email Report
                            </Button>
                        </Box>
                    </Paper>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Reports
                        </Typography>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Report Name</TableCell>
                                            <TableCell>Generated On</TableCell>
                                            <TableCell>Generated By</TableCell>
                                            <TableCell>Format</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Monthly Leave Report - Jan 2026</TableCell>
                                            <TableCell>2026-02-01</TableCell>
                                            <TableCell>Admin User</TableCell>
                                            <TableCell>PDF</TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Download /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </TabPanel>

                {/* Analytics Tab */}
                <TabPanel value={tabValue} index={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Leave Utilization by Department
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={departmentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="leaveDays" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Leave Type Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Annual', value: 450 },
                                                { name: 'Sick', value: 230 },
                                                { name: 'Casual', value: 180 },
                                                { name: 'Maternity', value: 90 },
                                                { name: 'Paternity', value: 45 },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry: any) => `${entry.name}: ${entry.value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {leaveTypeConfig.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Add Employee Dialog */}
            <Dialog open={openEmployeeDialog} onClose={() => setOpenEmployeeDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField fullWidth label="First Name" required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Last Name" required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Email" type="email" required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Employee Code" required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                label="Department"
                                required
                            >
                                <MenuItem value="1">Engineering</MenuItem>
                                <MenuItem value="2">HR</MenuItem>
                                <MenuItem value="3">Sales</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date of Joining"
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date of Birth"
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Manager"
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="1">Jane Smith (Engineering)</MenuItem>
                                <MenuItem value="2">Mike Johnson (HR)</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEmployeeDialog(false)}>Cancel</Button>
                    <Button variant="contained">Add Employee</Button>
                </DialogActions>
            </Dialog>

            {/* Add Leave Type Dialog */}
            <Dialog open={openLeaveTypeDialog} onClose={() => setOpenLeaveTypeDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Leave Type</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Leave Type Name" required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Default Days per Year"
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Carry Forward</InputLabel>
                                <Select label="Carry Forward">
                                    <MenuItem value="true">Yes</MenuItem>
                                    <MenuItem value="false">No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch />}
                                label="Allow Encashment"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLeaveTypeDialog(false)}>Cancel</Button>
                    <Button variant="contained">Add Leave Type</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};