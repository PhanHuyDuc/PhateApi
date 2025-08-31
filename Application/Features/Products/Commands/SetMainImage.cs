using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products.Commands
{
    public class SetMainImage
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string ImageId { get; set; }
            public int ProductId { get; set; }
        }
        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var product = await context.Products.Include(x => x.MultiImages).FirstOrDefaultAsync(x => x.Id == request.ProductId);

                if (product == null) return Result<Unit>.Failure("Cannot find Product", 400);

                var currentMainImage = product.MultiImages.FirstOrDefault(x => x.IsMain);

                if (currentMainImage != null) currentMainImage.IsMain = false;

                var newMainImage = await context.MultiImages.FirstOrDefaultAsync(x => x.Id == request.ImageId);

                if (newMainImage == null) return Result<Unit>.Failure("Cannot find photo", 400);

                newMainImage.IsMain = true;

                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Can not set Main Image", 400);
            }
        }
    }
}