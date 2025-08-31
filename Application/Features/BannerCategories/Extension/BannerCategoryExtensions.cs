using Domain;

namespace Application.BannerCategories.Extension
{
    public static class BannerCategoryExtensions
    {
        public static IQueryable<BannerCategory> Search(this IQueryable<BannerCategory> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}