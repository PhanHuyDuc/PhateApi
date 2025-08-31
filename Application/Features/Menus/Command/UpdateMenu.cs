using Application.Core;
using Application.Menus.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Menus.Command
{
    public class UpdateMenu
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required UpdateMenuDto MenuDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Validate ParentId
                if (request.MenuDto.ParentId.HasValue)
                {
                    if (request.MenuDto.ParentId == request.MenuDto.Id)
                        return Result<Unit>.Failure("Menu cannot be its own parent", 400);

                    // Check level of parent
                    var parentMenu = await context.Menus
                        .AsNoTracking()
                        .FirstOrDefaultAsync(m => m.Id == request.MenuDto.ParentId, cancellationToken);
                    if (parentMenu == null)
                        return Result<Unit>.Failure("Parent menu not found", 404);

                    // Set level based on parent
                    request.MenuDto.Level = parentMenu.Level + 1;
                    request.MenuDto.ParentName = parentMenu.Name;
                }

                var menu = await context.Menus.FindAsync(request.MenuDto.Id);
                if (menu == null) return Result<Unit>.Failure("Menu not found", 404);

                mapper.Map(request.MenuDto, menu);
                menu.IsActive = true;

                menu.ModifiedAt = DateTime.UtcNow;
                menu.ModifiedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "system";

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update menu", 400);
            }
        }
    }
}