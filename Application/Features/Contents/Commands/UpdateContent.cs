using Application.Core;
using Application.Features.Contents.DTOs;
using Application.Features.Contents.Extensions;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Features.Contents.Commands
{
    public class UpdateContent
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required UpdateContentDto ContentDto { get; set; }
            public required IFormFileCollection? ContentImages { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var content = await context.Contents.FindAsync([request.ContentDto.Id], cancellationToken);
                if (content == null) return Result<Unit>.Failure("Content not found", 404);
                content.Slug = request.ContentDto.Name.GenerateSlug(context.Contents);
                mapper.Map(request.ContentDto, content);

                if (request.ContentImages != null && request.ContentImages.Count > 0)
                {

                    foreach (var file in request.ContentImages)
                    {
                        var uploadResult = await imageService.UploadContentImage(file);
                        if (uploadResult == null || uploadResult.Error != null)
                        {
                            return Result<Unit>.Failure(uploadResult?.Error?.Message ?? "Failed to upload an image", 400);
                        }
                        var contentImage = new ContentImage
                        {
                            Url = uploadResult.SecureUrl.AbsoluteUri,
                            PublicId = uploadResult.PublicId,
                            Content = content,
                        };
                        content.ContentImages.Add(contentImage);
                    }
                }
                content.ModifiedAt = DateTime.UtcNow;
                content.ModifiedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "System";

                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update content", 400);
            }
        }
    }
}