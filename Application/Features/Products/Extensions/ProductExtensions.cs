using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Domain;

namespace Application.Products.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
        {
            query = orderBy switch
            {
                "price" => query.OrderBy(x => x.Price),
                "priceDesc" => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query,
            string? brands, string? types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            if (!string.IsNullOrEmpty(brands))
            {
                brandList.AddRange([.. brands.ToLower().Split(",")]);
            }

            if (!string.IsNullOrEmpty(types))
            {
                typeList.AddRange([.. types.ToLower().Split(",")]);
            }

            query = query.Where(x => brandList.Count == 0 || brandList.Contains(x.Brand.ToLower()));
            query = query.Where(x => typeList.Count == 0 || typeList.Contains(x.Type.ToLower()));

            return query;
        }
        public static string GenerateSlug(this string name, IQueryable<Product> query)
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
                slug = "product";

            // Check for uniqueness if existingProducts is provided
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