using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Menus.Command
{
    public class DeleteMenu
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required int Id { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var menu = await context.Menus
                                        .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);
                if (menu == null) return Result<Unit>.Failure("Menu not found", 404);

                context.Menus.Remove(menu);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete menu", 400);
            }
        }
    }
}