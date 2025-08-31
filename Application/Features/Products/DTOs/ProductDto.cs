using Domain;
namespace Application.Products.DTOs
{
    public class ProductDto
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
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string ModifiedBy { get; set; } = string.Empty;
        public ICollection<MultiImage> MultiImages { get; set; } = [];
    }
}