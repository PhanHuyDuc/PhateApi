namespace Application.BannerCategories.DTOs
{
    public class BannerCategoriesDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string CreateBy { get; set; } = string.Empty;
        public string ModifiedBy { get; set; } = string.Empty;

    }
}