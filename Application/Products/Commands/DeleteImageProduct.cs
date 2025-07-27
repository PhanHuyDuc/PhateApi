using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products.Commands
{
    public class DeleteImageProduct
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string ImagePublicId { get; set; }
        }
        public class Handler(AppDbContext context, IMultiImageService imageService) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var image = await context.MultiImages.FirstOrDefaultAsync(i => i.Id == request.ImagePublicId, cancellationToken);
                if (image == null) return Result<Unit>.Failure("Image not found", 404);
                if(image.IsMain == true) return Result<Unit>.Failure("Cannot delete the main image", 400);
                var deletionResult = await imageService.DeleteImage(image.PublicId);
                if (deletionResult.Error != null)
                {
                    return Result<Unit>.Failure(deletionResult.Error.Message, 400);
                }

                context.MultiImages.Remove(image);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete image", 400);
            }
        }
    }
}