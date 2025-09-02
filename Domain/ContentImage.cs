using System.Text.Json.Serialization;

namespace Domain
{
    public class ContentImage
    {
        public Guid Id { get; set; }
        public required string Url { get; set; }
        public required string PublicId { get; set; }

        public Guid ContentId { get; set; }

        public bool IsMain { get; set; }

        public int Order { get; set; }

        [JsonIgnore]
        public Content Content { get; set; } = null!;
    }
}