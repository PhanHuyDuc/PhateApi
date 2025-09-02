using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Banners.Extensions
{
    public static class BannerExtensions
    {
        public static IQueryable<Banner> Sort(this IQueryable<Banner> query, string? orderBy)
        {
            query = orderBy switch
            {
                "titleDesc" => query.OrderByDescending(x => x.Title),
                "mainCat" => query.Where(x => x.BannerCategory!.Name == "Main Banner" && x.IsActive == true),
                _ => query.OrderBy(x => x.Title)
            };

            return query;
        }



        public static IQueryable<Banner> Search(this IQueryable<Banner> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(x => x.Title.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}