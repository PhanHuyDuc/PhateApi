using Application.Core;
using MediatR;
using Persistence;

namespace Application.Banners.Commands
{
    public class ToggleActiveBanner
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required Guid Id { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var banner = await context.Banners.FindAsync([request.Id], cancellationToken);

                if (banner == null) return Result<Unit>.Failure("Banner not found", 404);

                banner.IsActive = !banner.IsActive;

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to change status", 400);
            }
        }

    }
}