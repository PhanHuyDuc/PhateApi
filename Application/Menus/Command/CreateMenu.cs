using Application.Core;
using Application.Menus.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Menus.Command
{
    public class CreateMenu
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateMenuDto MenuDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                request.MenuDto.Level = 1; // Default level for new menu items
                // Validate ParentId
                if (request.MenuDto.ParentId.HasValue)
                {
                    if (request.MenuDto.ParentId == request.MenuDto.Id) return Result<string>.Failure("Menu cannot be its own parent", 400);

                    //check level of parent
                    var parentMenu = await context.Menus
                        .AsNoTracking()
                        .FirstOrDefaultAsync(m => m.Id == request.MenuDto.ParentId, cancellationToken);
                    if (parentMenu == null) return Result<string>.Failure("Parent menu not found", 404);
                    //Set level based on parent
                    request.MenuDto.Level = parentMenu.Level + 1;
                }

                var menu = mapper.Map<Menu>(request.MenuDto);
                context.Menus.Add(menu);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ?
                    Result<string>.Success($"Menu created successfully Id: {menu.Id}") :
                    Result<string>.Failure("Failed to create menu", 400);
            }

        }
    }
}