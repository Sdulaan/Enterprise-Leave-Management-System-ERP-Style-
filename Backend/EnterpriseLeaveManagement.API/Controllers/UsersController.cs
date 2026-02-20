using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using EnterpriseLeaveManagement.Core.Entities;
using EnterpriseLeaveManagement.Data.Context;

namespace EnterpriseLeaveManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "HRAdmin")] // Only HR Admins can access user management
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        public UsersController(
            UserManager<User> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userManager.Users
                    .Include(u => u.Department)
                    .Include(u => u.Manager)
                    .ToListAsync();

                var userDtos = new List<object>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);

                    userDtos.Add(new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.EmployeeCode,
                        DepartmentId = user.Department?.Id,
                        DepartmentName = user.Department?.Name,
                        ManagerId = user.Manager?.Id,
                        ManagerName = user.Manager != null ? $"{user.Manager.FirstName} {user.Manager.LastName}" : null,
                        user.AnnualLeaveBalance,
                        user.SickLeaveBalance,
                        user.CasualLeaveBalance,
                        Role = roles.FirstOrDefault() ?? "Employee"
                    });
                }

                return Ok(new { success = true, data = userDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userManager.Users
                    .Include(u => u.Department)
                    .Include(u => u.Manager)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                var roles = await _userManager.GetRolesAsync(user);

                var userDto = new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.EmployeeCode,
                    DepartmentId = user.Department?.Id,
                    DepartmentName = user.Department?.Name,
                    ManagerId = user.Manager?.Id,
                    ManagerName = user.Manager != null ? $"{user.Manager.FirstName} {user.Manager.LastName}" : null,
                    user.AnnualLeaveBalance,
                    user.SickLeaveBalance,
                    user.CasualLeaveBalance,
                    Role = roles.FirstOrDefault() ?? "Employee",
                    user.DateOfBirth,
                    user.DateOfJoining
                };

                return Ok(new { success = true, data = userDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] string newRole)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, newRole);

                return Ok(new { success = true, message = "Role updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> DeactivateUser(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                user.LockoutEnd = DateTimeOffset.MaxValue;
                await _userManager.UpdateAsync(user);

                return Ok(new { success = true, message = "User deactivated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateUser(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                user.LockoutEnd = null;
                await _userManager.UpdateAsync(user);

                return Ok(new { success = true, message = "User activated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}