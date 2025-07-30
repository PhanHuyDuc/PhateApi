namespace Application.Menus.DTOs
{
    public class CreateMenuDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Url { get; set; }
        public string? Icon { get; set; }
        public int? ParentId { get; set; }
        public int Order { get; set; }
        public bool IsActive { get; set; }
        public required string Type { get; set; }
        public int Level { get; set; }
    }
}