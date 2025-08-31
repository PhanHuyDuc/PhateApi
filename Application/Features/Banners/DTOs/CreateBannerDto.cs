using Domain;
using Microsoft.AspNetCore.Http;

namespace Application.Banners.DTOs
{
    public class CreateBannerDto
    {

        public required string Title { get; set; }
        public required string Description { get; set; }
        public string Url { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty;
        public required string Link { get; set; }
        public bool IsActive { get; set; }
        public required Guid BannerCategoryId { get; set; }
        public BannerCategory? BannerCategory { get; set; }
        public required IFormFile File { get; set; } = null!;

    }
}