using Application.Core;

namespace Application.Features.Contents.Queries
{
    public class ContentParams : PaginationParams
    {
        public string? OrderBy { get; set; }
        public string? SearchTerm { get; set; }
        public string? Tag { get; set; }
    }
}