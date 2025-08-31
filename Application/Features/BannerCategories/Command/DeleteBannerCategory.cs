using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Menus.Command
{
    public class DeleteBannerCategory
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required Guid Id { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var bannerCategory = await context.BannerCategories
                                        .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);
                if (bannerCategory == null) return Result<Unit>.Failure("banner Category not found", 404);

                context.BannerCategories.Remove(bannerCategory);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete banner category", 400);
            }
        }
    }
}