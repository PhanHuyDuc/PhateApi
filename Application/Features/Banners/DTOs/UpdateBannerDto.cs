using Domain;
using Microsoft.AspNetCore.Http;

namespace Application.Banners.DTOs
{
    public class UpdateBannerDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? Url { get; set; }
        public string? PublicId { get; set; }
        public required string Link { get; set; }
        public bool IsActive { get; set; }
        public required string BannerCategoryId { get; set; }
        public BannerCategory? BannerCategory { get; set; }
        public IFormFile? File { get; set; }
    }
}