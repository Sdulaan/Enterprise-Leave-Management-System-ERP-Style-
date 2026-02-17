using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using EnterpriseLeaveManagement.Core.Interfaces;
using EnterpriseLeaveManagement.Core.DTOs;

namespace EnterpriseLeaveManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveService _leaveService;
        private readonly ILogger<LeaveController> _logger;

        public LeaveController(ILeaveService leaveService, ILogger<LeaveController> logger)
        {
            _leaveService = leaveService;
            _logger = logger;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyLeave([FromBody] ApplyLeaveDto applyLeaveDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var result = await _leaveService.ApplyLeaveAsync(applyLeaveDto, userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying for leave");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetLeaveHistory()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var result = await _leaveService.GetEmployeeLeaveHistoryAsync(userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting leave history");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("balance")]
        public async Task<IActionResult> GetLeaveBalance()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var result = await _leaveService.GetLeaveBalanceAsync(userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting leave balance");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Manager,HRAdmin")]
        public async Task<IActionResult> ApproveLeave(int id, [FromBody] string? comments)
        {
            try
            {
                var approverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(approverId))
                    return Unauthorized();

                var result = await _leaveService.ApproveLeaveAsync(id, approverId, comments);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving leave");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Manager,HRAdmin")]
        public async Task<IActionResult> RejectLeave(int id, [FromBody] string reason)
        {
            try
            {
                var approverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(approverId))
                    return Unauthorized();

                var result = await _leaveService.RejectLeaveAsync(id, approverId, reason);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting leave");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("team-pending")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetTeamPendingLeaves()
        {
            try
            {
                var managerIdClaim = User.FindFirst("EmployeeId")?.Value;
                if (string.IsNullOrEmpty(managerIdClaim))
                    return Unauthorized();

                var result = await _leaveService.GetTeamLeaveRequestsAsync(managerIdClaim);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting team leaves");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("generate-report")]
        [Authorize(Roles = "HRAdmin")]
        public async Task<IActionResult> GenerateReport([FromBody] ReportRequestDto reportRequest)
        {
            try
            {
                var reportData = await _leaveService.GenerateLeaveReportAsync(reportRequest);

                var contentType = reportRequest.Format.ToUpper() == "PDF"
                    ? "application/pdf"
                    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                var fileName = $"LeaveReport_{DateTime.Now:yyyyMMdd}.{reportRequest.Format.ToLower()}";

                return File(reportData, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}