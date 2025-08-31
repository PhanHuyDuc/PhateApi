using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Banners.Commands
{
    public class DeleteBanner
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required Guid Id { get; set; }
        }
        public class Handler(AppDbContext context, IMultiImageService imageService) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var banner = await context.Banners
                                        .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

                if (banner == null) return Result<Unit>.Failure("Banner not found", 404);

                var deletionResult = await imageService.DeleteImage(banner.PublicId);
                if (deletionResult.Error != null)
                {
                    return Result<Unit>.Failure(deletionResult.Error.Message, 400);
                }

                context.Banners.Remove(banner);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete Banner", 400);
            }
        }
    }
}