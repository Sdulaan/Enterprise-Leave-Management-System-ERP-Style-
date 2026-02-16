using System;

namespace EnterpriseLeaveManagement.Core.DTOs
{
    public class LeaveRequestDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal NumberOfDays { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Comments { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ApplyLeaveDto
    {
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class LeaveBalanceDto
    {
        public decimal AnnualLeave { get; set; }
        public decimal SickLeave { get; set; }
        public decimal CasualLeave { get; set; }
    }

    public class ReportRequestDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? DepartmentId { get; set; }
        public LeaveStatus? Status { get; set; }
        public string Format { get; set; } = "PDF";
    }
}