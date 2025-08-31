using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Domain;

namespace Application.Features.Contents.Extensions
{
    public static class ContentExtensions
    {
        public static IQueryable<Content> Sort(this IQueryable<Content> query, string? orderBy)
        {
            query = orderBy switch
            {

                "nameDesc" => query.OrderByDescending(x => x.Name),
                _ => query.OrderBy(x => x.Name)
            };

            return query;
        }

        public static IQueryable<Content> Search(this IQueryable<Content> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Content> Filter(this IQueryable<Content> query,
             string? tags)
        {

            var tag = new List<string>();

            if (!string.IsNullOrEmpty(tags))
            {
                tag.AddRange([.. tags.ToLower().Split(",")]);
            }


            query = query.Where(x => tag.Count == 0 || tag.Contains(x.Tag.ToLower()));

            return query;
        }
        public static string GenerateSlug(this string name, IQueryable<Content> query)
        {
            if (string.IsNullOrWhiteSpace(name))
                return string.Empty;

            // Convert to lowercase and normalize Unicode characters (e.g., "à" -> "a")
            string normalized = name.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            // Remove diacritics
            foreach (var c in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            string slug = stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();

            // Replace spaces and special characters with hyphens
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", ""); // Remove invalid chars
            slug = Regex.Replace(slug, @"\s+", "-"); // Replace spaces with hyphens
            slug = Regex.Replace(slug, @"-+", "-"); // Replace multiple hyphens with single
            slug = slug.Trim('-'); // Remove leading/trailing hyphens

            // Ensure slug is not empty
            if (string.IsNullOrEmpty(slug))
                slug = "Content";

            // Check for uniqueness if existingContents is provided
            if (query != null)
            {
                int suffix = 1;
                string baseSlug = slug;
                while (query.Any(p => p.Slug == slug))
                {
                    slug = $"{baseSlug}-{suffix}";
                    suffix++;
                }
            }

            return slug;
        }
    }
}