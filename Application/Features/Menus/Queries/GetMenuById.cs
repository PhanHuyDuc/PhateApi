using Application.Core;
using Application.Menus.DTOs;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Menus.Queries
{
    public class GetMenuById
    {
        public class Query : IRequest<Result<MenuDto>>
        {
            public int Id { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<MenuDto>>
        {
            public async Task<Result<MenuDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var menu = await context.Menus.FindAsync([request.Id], cancellationToken);

                if (menu == null) return Result<MenuDto>.Failure("Menu not found", 404);

                var menuDto = mapper.Map<MenuDto>(menu);

                return Result<MenuDto>.Success(menuDto);
            }
        }

    }
}