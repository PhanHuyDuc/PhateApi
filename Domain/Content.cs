using System.Text.Json.Serialization;

namespace Domain
{
    public class Content : Entity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public string Slug { get; set; } = string.Empty;
        public required string Tag { get; set; }
        public required string Artist { get; set; }
        public bool Favorite { get; set; }
        public ICollection<ContentImage> ContentImages { get; set; } = [];

    }
}