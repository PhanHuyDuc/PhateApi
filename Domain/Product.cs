namespace Domain
{
    public class Product : Entity
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string ShortDescription { get; set; }
        public long Price { get; set; }
        public long SaleOff { get; set; }
        public required string Type { get; set; }
        public required string Brand { get; set; }
        public int QuantityInStock { get; set; }
        public required string Slug { get; set; }
        public string? Rating { get; set; }
        public int NumReview { get; set; }
        public ICollection<MultiImage> MultiImages { get; set; } = [];
    }
}