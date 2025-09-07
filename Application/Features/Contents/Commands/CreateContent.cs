using Application.Core;
using Application.Features.Artists.DTOs;
using Application.Features.Contents.DTOs;
using Application.Features.Contents.Extensions;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Contents.Commands
{
    public class CreateContent
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateContentDto ContentDto { get; set; }
            public required IFormFileCollection? ContentImages { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var content = mapper.Map<Content>(request.ContentDto);

                if (request.ContentImages != null && request.ContentImages.Count > 0)
                {
                    bool isMainSet = true;
                    foreach (var file in request.ContentImages)
                    {
                        var uploadResult = await imageService.UploadContentImage(file);

                        // Check if the upload was failed
                        if (uploadResult == null || uploadResult.Error != null)
                        {
                            return Result<string>.Failure(
                            uploadResult?.Error?.Message ?? "Failed to upload an image",
                            400
                        );
                        }

                        // Extract order from file name (e.g., "1.webp" -> 1)
                        string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        int order = 0;
                        if (!int.TryParse(fileName, out order))
                        {
                            order = content.ContentImages.Count + 1; // Fallback to sequential order
                        }

                        // Create ContentImages entity
                        var contentImage = new ContentImage
                        {
                            Url = uploadResult.SecureUrl.AbsoluteUri,
                            PublicId = uploadResult.PublicId,
                            Content = content,
                            IsMain = isMainSet,
                            Order = order
                        };

                        content.ContentImages.Add(contentImage);
                        isMainSet = false; // Only the first image will be set as main
                    }
                }
                // Generate slug
                content.Slug = request.ContentDto.Name.GenerateSlug(context.Contents);

                content.CreatedAt = DateTime.UtcNow;
                content.CreatedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "system";
                context.Contents.Add(content);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                 ? Result<string>.Success($"Create Content success, Id: {content.Id}")
                 : Result<string>.Failure("Failed to create content", 400);

            }
        }
    }
}