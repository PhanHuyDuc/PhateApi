using System.Text.Json.Serialization;

namespace Domain
{
    public class MultiImage
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Url { get; set; }
        public required string PublicId { get; set; }

        public int ProductId { get; set; }

        public bool IsMain { get; set; }

        [JsonIgnore]
        public Product Product { get; set; } = null!;
    }
}