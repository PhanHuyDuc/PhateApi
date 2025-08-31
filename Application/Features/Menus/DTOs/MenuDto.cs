
namespace Application.Menus.DTOs
{
    public class MenuDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Url { get; set; }
        public int? ParentId { get; set; }
        public string ParentName { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool IsActive { get; set; }
        public required string Type { get; set; }
        public int Level { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string ModifiedBy { get; set; } = string.Empty;
        


    }
}