using Application.Banners.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Banners.Commands
{
    public class CreateBanner
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateBannerDto BannerDto { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Validate BannerCategoryId
                var bannerCategoryExists = await context.BannerCategories
                    .AnyAsync(x => x.Id == request.BannerDto.BannerCategoryId, cancellationToken);
                if (!bannerCategoryExists)
                    return Result<string>.Failure($"No BannerCategory found with ID {request.BannerDto.BannerCategoryId}", 400);


                var banner = mapper.Map<Banner>(request.BannerDto);

                if (request.BannerDto.File != null && request.BannerDto.File.Length > 0)
                {
                    var uploadResult = await imageService.UploadImage(request.BannerDto.File);
                    // Check if the upload was failed
                    if (uploadResult == null || uploadResult.Error != null)
                    {
                        return Result<string>.Failure(
                            uploadResult?.Error?.Message ?? "Failed to upload an image",
                            400
                        );
                    }
                    banner.Url = uploadResult.SecureUrl.AbsoluteUri;
                    banner.PublicId = uploadResult.PublicId;
                }
                banner.CreatedAt = DateTime.UtcNow;
                banner.CreatedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
                banner.IsActive = true;
                context.Banners.Add(banner);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                 ? Result<string>.Success($"Create Banner success, Id: {banner.Id}")
                 : Result<string>.Failure("Failed to create Banner", 400);
            }
        }
    }
}