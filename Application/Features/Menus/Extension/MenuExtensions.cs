using Domain;

namespace Application.Menus.Extension
{
    public static class MenuExtensions
    {
        public static IQueryable<Menu> Search(this IQueryable<Menu> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}