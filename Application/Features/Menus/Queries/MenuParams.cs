using Application.Core;

namespace Application.Menus.Queries
{
    public class MenuParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
    }
}