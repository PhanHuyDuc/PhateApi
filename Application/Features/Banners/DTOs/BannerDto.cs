using Domain;
namespace Application.Banners.DTOs
{
    public class BannerDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? Url { get; set; }
        public string? PublicId { get; set; }
        public required string Link { get; set; }
        public bool IsActive { get; set; }
        public required string BannerCategoryId { get; set; }
        public required BannerCategory BannerCategory { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string ModifiedBy { get; set; } = string.Empty;

    }
}