using Application.Core;

namespace Application.Banners.Queries
{
    public class BannerParams : PaginationParams
    {
        public string? OrderBy { get; set; }
        public string? SearchTerm { get; set; }

    }
}