using System;

namespace EnterpriseLeaveManagement.Core.Entities
{
    public class LeaveRequest : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal NumberOfDays { get; set; }
        public string Reason { get; set; } = string.Empty;
        public LeaveStatus Status { get; set; }
        public string? Comments { get; set; }
        public DateTime? ActionDate { get; set; }
        public string? ActionedBy { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
    }

    public enum LeaveType
    {
        Annual = 1,
        Sick = 2,
        Casual = 3,
        Maternity = 4,
        Paternity = 5,
        Unpaid = 6
    }

    public enum LeaveStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3,
        Cancelled = 4
    }
}