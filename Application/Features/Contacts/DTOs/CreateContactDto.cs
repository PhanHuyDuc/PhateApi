namespace Application.Contacts.DTOs
{
    public class CreateContactDto
    {
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public required string Description { get; set; }
        public bool IsResolve { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}