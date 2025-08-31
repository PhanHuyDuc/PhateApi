using Application.Core;

namespace Application.Features.Artists.Queries
{
    public class ArtistParams : PaginationParams
    {
        public string? OrderBy { get; set; }
        public string? SearchTerm { get; set; }
    }
}