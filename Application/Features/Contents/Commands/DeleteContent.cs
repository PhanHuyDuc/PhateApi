using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Contents.Commands
{
    public class DeleteContent
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required Guid Id { get; set; }
        }
        public class Handler(AppDbContext context, IMultiImageService imageService) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var content = await context.Contents
                                        .Include(p => p.ContentImages)
                                        .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
                if (content == null) return Result<Unit>.Failure("Content not found", 404);
                // Delete associated images from Cloudinary
                foreach (var image in content.ContentImages)
                {
                    var deletionResult = await imageService.DeleteImage(image.PublicId);
                    if (deletionResult.Error != null)
                    {
                        return Result<Unit>.Failure(deletionResult.Error.Message, 400);
                    }
                }
                context.ContentImages.RemoveRange(content.ContentImages); // Remove images from the context
                context.Contents.Remove(content);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete content", 400);
            }
        }
    }
}