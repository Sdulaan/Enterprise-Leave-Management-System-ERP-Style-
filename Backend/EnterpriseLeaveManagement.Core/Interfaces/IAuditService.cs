using System.Threading.Tasks;

namespace EnterpriseLeaveManagement.Core.Interfaces
{
    public interface IAuditService
    {
        Task LogActionAsync(string entityType, int entityId, string action, string userId);
    }
}