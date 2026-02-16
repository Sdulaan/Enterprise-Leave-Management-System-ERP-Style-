using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace EnterpriseLeaveManagement.Core.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmployeeCode { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public DateTime DateOfJoining { get; set; }
        public int? DepartmentId { get; set; }
        public int? ManagerId { get; set; }
        public UserRole Role { get; set; }
        public decimal AnnualLeaveBalance { get; set; }
        public decimal SickLeaveBalance { get; set; }
        public decimal CasualLeaveBalance { get; set; }

        // Navigation properties
        public virtual Department? Department { get; set; }
        public virtual User? Manager { get; set; }
        public virtual ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    }

    public enum UserRole
    {
        Employee = 1,
        Manager = 2,
        HRAdmin = 3
    }
}