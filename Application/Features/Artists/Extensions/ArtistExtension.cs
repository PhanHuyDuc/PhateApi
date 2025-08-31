using Domain;

namespace Application.Features.Artists.Extensions
{
    public static class ArtistExtension
    {
        public static IQueryable<Artist> Sort(this IQueryable<Artist> query, string? orderBy)
        {
            query = orderBy switch
            {
                "nameDesc" => query.OrderByDescending(x => x.Name),
                _ => query.OrderBy(x => x.Name)
            };

            return query;
        }

        public static IQueryable<Artist> Search(this IQueryable<Artist> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}