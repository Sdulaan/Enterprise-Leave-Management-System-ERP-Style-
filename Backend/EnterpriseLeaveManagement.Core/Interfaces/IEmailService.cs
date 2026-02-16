using System.Threading.Tasks;

namespace EnterpriseLeaveManagement.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}