namespace Domain
{
    public class BannerCategory : Entity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;

    }
}