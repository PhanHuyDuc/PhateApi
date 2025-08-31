namespace Application.BannerCategories.DTOs
{
    public class UpdateBannerCategoriesDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;

    }
}