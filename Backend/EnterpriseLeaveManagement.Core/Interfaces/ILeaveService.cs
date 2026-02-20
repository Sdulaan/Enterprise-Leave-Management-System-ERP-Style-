using System.Collections.Generic;
using System.Threading.Tasks;
using EnterpriseLeaveManagement.Core.DTOs;

namespace EnterpriseLeaveManagement.Core.Interfaces
{
    public interface ILeaveService
    {
        Task<LeaveRequestDto> ApplyLeaveAsync(ApplyLeaveDto applyLeaveDto, string userId);
        Task<LeaveRequestDto> ApproveLeaveAsync(int leaveRequestId, string approverId, string? comments = null);
        Task<LeaveRequestDto> RejectLeaveAsync(int leaveRequestId, string approverId, string reason);
        Task<IEnumerable<LeaveRequestDto>> GetEmployeeLeaveHistoryAsync(string userId);
        Task<IEnumerable<LeaveRequestDto>> GetTeamLeaveRequestsAsync(string managerId);
        Task<LeaveBalanceDto> GetLeaveBalanceAsync(string userId);
        Task<byte[]> GenerateLeaveReportAsync(ReportRequestDto reportRequest);
        Task<IEnumerable<LeaveRequestDto>> GetAllLeaveRequestsAsync();

    }
}