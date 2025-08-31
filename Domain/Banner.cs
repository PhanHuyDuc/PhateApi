using System.Text.Json.Serialization;

namespace Domain
{
    public class Banner : Entity
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Url { get; set; }
        public required string PublicId { get; set; }
        public required string Link { get; set; }
        public bool IsActive { get; set; }
        public required Guid BannerCategoryId { get; set; }
        [JsonIgnore]
        public BannerCategory? BannerCategory { get; set; }

    }
}