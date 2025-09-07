using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Contents.Commands
{
    public class AppendContentImages
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid ContentId { get; set; }
            public required IFormFileCollection ContentImages { get; set; }
        }
        public class Handler(AppDbContext context, IMultiImageService imageService) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var content = await context.Contents
                    .Include(c => c.ContentImages)
                    .FirstOrDefaultAsync(c => c.Id == request.ContentId, cancellationToken);

                if (content == null)
                {
                    return Result<Unit>.Failure("Content not found", 404);
                }

                if (request.ContentImages != null && request.ContentImages.Count > 0)
                {
                    bool isMainSet = !content.ContentImages.Any();

                    foreach (var file in request.ContentImages)
                    {
                        var uploadResult = await imageService.UploadContentImage(file);

                        if (uploadResult == null || uploadResult.Error != null)
                        {
                            return Result<Unit>.Failure(uploadResult?.Error?.Message ?? "Failed to upload an image", 400);
                        }

                        string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        int order = 0;
                        if (!int.TryParse(fileName, out order))
                        {
                            order = content.ContentImages.Count + 1;
                        }

                        var contentImage = new ContentImage
                        {
                            Url = uploadResult.SecureUrl.AbsoluteUri,
                            PublicId = uploadResult.PublicId,
                            ContentId = content.Id,
                            IsMain = isMainSet,
                            Order = order
                        };

                        content.ContentImages.Add(contentImage);
                        isMainSet = false;
                    }
                }

                var saved = await context.SaveChangesAsync(cancellationToken) > 0;
                return saved ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to append images", 400);
            }
        }
    }
}