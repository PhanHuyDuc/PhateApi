using Application.Core;
using Application.Menus.DTOs;
using Application.Menus.Extension;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Menus.Queries
{
    public class GetMenuList
    {
        public class Query : IRequest<Result<PagedList<MenuDto>>>
        {
            public required MenuParams Params { get; set; }

        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<MenuDto>>>
        {
            public async Task<Result<PagedList<MenuDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Menus.Search(request.Params.SearchTerm).AsQueryable();

                var menus = await PagedList<MenuDto>.ToPagedList(
                    query.ProjectTo<MenuDto>(mapper.ConfigurationProvider),
                    request.Params.PageNumber, request.Params.PageSize);

                if (!menus.Any()) return Result<PagedList<MenuDto>>.Failure("No menus found", 404);

                return Result<PagedList<MenuDto>>.Success(menus);
            }
        }
    }
}