import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { leaveService, ApplyLeaveDto } from '../../services/leaveService';

interface LeaveRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    leaveType: 1,
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
  });

  const handleSubmit = async () => {
    try {
      const leaveData: ApplyLeaveDto = {
        leaveType: formData.leaveType,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        reason: formData.reason,
      };
      
      await leaveService.applyLeave(leaveData);
      onSubmit();
    } catch (error) {
      console.error('Error applying for leave:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Apply for Leave</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Leave Type"
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: Number(e.target.value) })}
            >
              <MenuItem value={1}>Annual Leave</MenuItem>
              <MenuItem value={2}>Sick Leave</MenuItem>
              <MenuItem value={3}>Casual Leave</MenuItem>
              <MenuItem value={4}>Maternity Leave</MenuItem>
              <MenuItem value={5}>Paternity Leave</MenuItem>
              <MenuItem value={6}>Unpaid Leave</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => date && setFormData({ ...formData, startDate: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => date && setFormData({ ...formData, endDate: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason"
              multiline
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};