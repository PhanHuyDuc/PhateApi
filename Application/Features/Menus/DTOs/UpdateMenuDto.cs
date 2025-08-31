namespace Application.Menus.DTOs
{
    public class UpdateMenuDto
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
    }
}