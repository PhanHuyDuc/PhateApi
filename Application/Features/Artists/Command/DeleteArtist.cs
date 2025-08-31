using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Artists.Command
{
    public class DeleteArtist
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required Guid Id { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var artist = await context.Artists
                                        .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);
                if (artist == null) return Result<Unit>.Failure("Artist not found", 404);

                context.Artists.Remove(artist);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete artist", 400);
            }
        }
    }
}