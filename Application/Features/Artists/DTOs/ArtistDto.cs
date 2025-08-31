namespace Application.Features.Artists.DTOs
{
    public class ArtistDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }
}