using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using EnterpriseLeaveManagement.Core.Interfaces;

namespace EnterpriseLeaveManagement.Services.Services
{
    public class AuditService : IAuditService
    {
        private readonly ILogger<AuditService> _logger;

        public AuditService(ILogger<AuditService> logger)
        {
            _logger = logger;
        }

        public async Task LogActionAsync(string entityType, int entityId, string action, string userId)
        {
            _logger.LogInformation(
                "Audit Log - Entity: {EntityType}, ID: {EntityId}, Action: {Action}, User: {UserId}, Time: {Time}",
                entityType, entityId, action, userId, DateTime.UtcNow
            );

            await Task.CompletedTask;
        }
    }
}