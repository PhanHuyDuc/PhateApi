using System.ComponentModel.DataAnnotations;

namespace Application.Users.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        public required string Password { get; set; }
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
    }
}