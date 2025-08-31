using Application.Core;

namespace Application.BannerCategories.Queries
{
    public class BannerCategoryParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
    }
}