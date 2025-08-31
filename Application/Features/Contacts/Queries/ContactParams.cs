using Application.Core;

namespace Application.Features.Contacts.Queries
{
    public class ContactParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
    }
}