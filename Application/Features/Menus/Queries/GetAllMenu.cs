using Application.Core;
using Application.Menus.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Menus.Queries
{
    public class GetAllMenu
    {
        public class Query : IRequest<Result<List<MenuDto>>>
        { }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<List<MenuDto>>>
        {
            public async Task<Result<List<MenuDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var menus = await context.Menus.ProjectTo<MenuDto>(mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                if (!menus.Any()) return Result<List<MenuDto>>.Failure("No menus found", 404);
                return Result<List<MenuDto>>.Success(menus);

            }
        }
    }
}