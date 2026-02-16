import React, { useState } from 'react';
import { EmployeeDashboard } from '../components/Dashboard/EmployeeDashboard';
import { ManagerDashboard } from '../components/Dashboard/ManagerDashboard';
import { HRDashboard } from '../components/Dashboard/HRDashboard';
import { Navbar } from '../components/Layout/Navbar';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const Dashboard: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const userRole = localStorage.getItem('userRole') || 'Employee';
    const userName = localStorage.getItem('userName') || 'User';

    const renderDashboard = () => {
        switch (userRole) {
            case 'HRAdmin':
                return <HRDashboard />;
            case 'Manager':
                return <ManagerDashboard />;
            default:
                return <EmployeeDashboard />;
        }
    };

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
                <ListItem button>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><EventIcon /></ListItemIcon>
                    <ListItemText primary="Leave Requests" />
                </ListItem>
                {userRole !== 'Employee' && (
                    <ListItem button>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="Team" />
                    </ListItem>
                )}
                {userRole === 'HRAdmin' && (
                    <ListItem button>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="Reports" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <Box>
            <Navbar
                userRole={userRole}
                userName={userName}
                onMenuClick={() => setDrawerOpen(true)}
            />
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {drawer}
            </Drawer>
            {renderDashboard()}
        </Box>
    );
};