namespace Application.BannerCategories.DTOs
{
    public class CreateBannerCategoriesDto
    {
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
      
    }
}