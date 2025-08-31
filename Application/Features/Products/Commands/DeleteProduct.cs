using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products.Commands
{
    public class DeleteProduct
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required int Id { get; set; }
        }
        public class Handler(AppDbContext context, IMultiImageService imageService) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var product = await context.Products
                                        .Include(p => p.MultiImages)
                                        .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
                if (product == null) return Result<Unit>.Failure("Product not found", 404);
                // Delete associated images from Cloudinary
                foreach (var image in product.MultiImages)
                {
                    var deletionResult = await imageService.DeleteImage(image.PublicId);
                    if (deletionResult.Error != null)
                    {
                        return Result<Unit>.Failure(deletionResult.Error.Message, 400);
                    }
                }
                context.MultiImages.RemoveRange(product.MultiImages); // Remove images from the context
                context.Products.Remove(product);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete product", 400);
            }
        }
    }
}