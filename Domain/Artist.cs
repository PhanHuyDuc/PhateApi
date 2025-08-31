using System.Text.Json.Serialization;

namespace Domain
{
    public class Artist : Entity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }
}