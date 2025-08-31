using Domain;

namespace Application.Features.Contacts.Extensions
{
    public static class ContactExtensions
    {
         public static IQueryable<Contact> Search(this IQueryable<Contact> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}