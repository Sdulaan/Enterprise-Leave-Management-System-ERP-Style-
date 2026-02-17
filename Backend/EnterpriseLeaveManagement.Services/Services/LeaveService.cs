using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnterpriseLeaveManagement.Core.Entities;
using EnterpriseLeaveManagement.Core.Interfaces;
using EnterpriseLeaveManagement.Core.DTOs;
using EnterpriseLeaveManagement.Data.Context;

namespace EnterpriseLeaveManagement.Services.Services
{
    public class LeaveService : ILeaveService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IAuditService _auditService;
        private readonly ILogger<LeaveService> _logger;

        public LeaveService(
            ApplicationDbContext context,
            IEmailService emailService,
            IAuditService auditService,
            ILogger<LeaveService> logger)
        {
            _context = context;
            _emailService = emailService;
            _auditService = auditService;
            _logger = logger;
        }

        public async Task<LeaveRequestDto> ApplyLeaveAsync(ApplyLeaveDto applyLeaveDto, string userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new Exception("User not found");

                var numberOfDays = (applyLeaveDto.EndDate - applyLeaveDto.StartDate).Days + 1;

                if (!await HasSufficientLeaveBalance(userId, applyLeaveDto.LeaveType, numberOfDays))
                    throw new Exception("Insufficient leave balance");

                var leaveRequest = new LeaveRequest
                {
                    UserId = userId,
                    LeaveType = applyLeaveDto.LeaveType,
                    StartDate = applyLeaveDto.StartDate,
                    EndDate = applyLeaveDto.EndDate,
                    NumberOfDays = numberOfDays,
                    Reason = applyLeaveDto.Reason,
                    Status = LeaveStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.LeaveRequests.AddAsync(leaveRequest);
                await _context.SaveChangesAsync();

                await NotifyManagerAsync(userId, leaveRequest);
                await _auditService.LogActionAsync("LeaveRequest", leaveRequest.Id, "Apply", userId);

                _logger.LogInformation($"Leave request {leaveRequest.Id} created by user {userId}");

                return MapToDto(leaveRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying for leave");
                throw;
            }
        }

        public async Task<LeaveRequestDto> ApproveLeaveAsync(int leaveRequestId, string approverId, string? comments = null)
        {
            var leaveRequest = await _context.LeaveRequests
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.Id == leaveRequestId);

            if (leaveRequest == null)
                throw new Exception("Leave request not found");

            if (leaveRequest.Status != LeaveStatus.Pending)
                throw new Exception("Only pending requests can be approved");

            await DeductLeaveBalance(leaveRequest.UserId, leaveRequest.LeaveType, leaveRequest.NumberOfDays);

            leaveRequest.Status = LeaveStatus.Approved;
            leaveRequest.ActionDate = DateTime.UtcNow;
            leaveRequest.ActionedBy = approverId;
            leaveRequest.Comments = comments;

            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                leaveRequest.User.Email!,
                "Leave Request Approved",
                $"Your leave request from {leaveRequest.StartDate:d} to {leaveRequest.EndDate:d} has been approved."
            );

            await _auditService.LogActionAsync("LeaveRequest", leaveRequest.Id, "Approve", approverId);

            return MapToDto(leaveRequest);
        }

        public async Task<LeaveRequestDto> RejectLeaveAsync(int leaveRequestId, string approverId, string reason)
        {
            var leaveRequest = await _context.LeaveRequests
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.Id == leaveRequestId);

            if (leaveRequest == null)
                throw new Exception("Leave request not found");

            leaveRequest.Status = LeaveStatus.Rejected;
            leaveRequest.ActionDate = DateTime.UtcNow;
            leaveRequest.ActionedBy = approverId;
            leaveRequest.Comments = reason;

            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                leaveRequest.User.Email!,
                "Leave Request Rejected",
                $"Your leave request from {leaveRequest.StartDate:d} to {leaveRequest.EndDate:d} has been rejected. Reason: {reason}"
            );

            return MapToDto(leaveRequest);
        }

        public async Task<IEnumerable<LeaveRequestDto>> GetEmployeeLeaveHistoryAsync(string userId)
        {
            var leaves = await _context.LeaveRequests
                .Where(l => l.UserId == userId && !l.IsDeleted)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return leaves.Select(MapToDto);
        }

        public async Task<IEnumerable<LeaveRequestDto>> GetTeamLeaveRequestsAsync(string managerId)
        {
            var teamLeaves = await _context.LeaveRequests
                .Include(l => l.User)
                .Where(l => l.User.ManagerId == managerId && l.Status == LeaveStatus.Pending)
                .OrderBy(l => l.StartDate)
                .ToListAsync();

            return teamLeaves.Select(MapToDto);
        }

        public async Task<LeaveBalanceDto> GetLeaveBalanceAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            return new LeaveBalanceDto
            {
                AnnualLeave = user.AnnualLeaveBalance,
                SickLeave = user.SickLeaveBalance,
                CasualLeave = user.CasualLeaveBalance
            };
        }

        public async Task<byte[]> GenerateLeaveReportAsync(ReportRequestDto reportRequest)
        {
            var query = _context.LeaveRequests
                .Include(l => l.User)
                .ThenInclude(u => u.Department)
                .AsQueryable();

            if (reportRequest.StartDate.HasValue)
                query = query.Where(l => l.StartDate >= reportRequest.StartDate);

            if (reportRequest.EndDate.HasValue)
                query = query.Where(l => l.EndDate <= reportRequest.EndDate);

            if (reportRequest.DepartmentId.HasValue)
                query = query.Where(l => l.User.DepartmentId == reportRequest.DepartmentId);

            if (reportRequest.Status.HasValue)
                query = query.Where(l => l.Status == reportRequest.Status);

            var data = await query.ToListAsync();

            return GenerateReportFile(data, reportRequest.Format);
        }

        private async Task<bool> HasSufficientLeaveBalance(string userId, LeaveType leaveType, decimal days)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            return leaveType switch
            {
                LeaveType.Annual => user.AnnualLeaveBalance >= days,
                LeaveType.Sick => user.SickLeaveBalance >= days,
                LeaveType.Casual => user.CasualLeaveBalance >= days,
                _ => true
            };
        }

        private async Task DeductLeaveBalance(string userId, LeaveType leaveType, decimal days)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return;

            switch (leaveType)
            {
                case LeaveType.Annual:
                    user.AnnualLeaveBalance -= days;
                    break;
                case LeaveType.Sick:
                    user.SickLeaveBalance -= days;
                    break;
                case LeaveType.Casual:
                    user.CasualLeaveBalance -= days;
                    break;
            }

            await _context.SaveChangesAsync();
        }

        private async Task NotifyManagerAsync(string userId, LeaveRequest leaveRequest)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.ManagerId == null) return;

            var manager = await _context.Users.FindAsync(user.ManagerId);
            if (manager?.Email == null) return;

            await _emailService.SendEmailAsync(
                manager.Email,
                "New Leave Request",
                $"Employee {user.FirstName} {user.LastName} has requested leave from {leaveRequest.StartDate:d} to {leaveRequest.EndDate:d}"
            );
        }

        private LeaveRequestDto MapToDto(LeaveRequest leaveRequest)
        {
            return new LeaveRequestDto
            {
                Id = leaveRequest.Id,
                UserId = leaveRequest.UserId,
                UserName = $"{leaveRequest.User?.FirstName} {leaveRequest.User?.LastName}",
                LeaveType = leaveRequest.LeaveType.ToString(),
                StartDate = leaveRequest.StartDate,
                EndDate = leaveRequest.EndDate,
                NumberOfDays = leaveRequest.NumberOfDays,
                Reason = leaveRequest.Reason,
                Status = leaveRequest.Status.ToString(),
                Comments = leaveRequest.Comments,
                CreatedAt = leaveRequest.CreatedAt
            };
        }

        private byte[] GenerateReportFile(List<LeaveRequest> data, string format)
        {
            // Placeholder for report generation logic
            return Array.Empty<byte>();
        }
    }
}