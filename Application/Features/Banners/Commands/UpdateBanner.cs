using Application.Core;
using Application.Interfaces;
using Application.Banners.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using Microsoft.AspNetCore.Http;

namespace Application.Banners.Commands
{
    public class UpdateBanner
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required UpdateBannerDto BannerDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {

                var banner = await context.Banners.FindAsync([request.BannerDto.Id], cancellationToken);

                if (banner == null) return Result<Unit>.Failure("Banner not found", 404);

                mapper.Map(request.BannerDto, banner);

                if (request.BannerDto.File != null)
                {
                    if (!string.IsNullOrEmpty(banner.PublicId))
                    {
                        var deletionResult = await imageService.DeleteImage(banner.PublicId);

                        if (deletionResult.Error != null)
                        {
                            return Result<Unit>.Failure(deletionResult.Error.Message, 400);
                        }
                    }

                    var uploadResult = await imageService.UploadImage(request.BannerDto.File);

                    if (uploadResult == null || uploadResult.Error != null)
                    {
                        return Result<Unit>.Failure(uploadResult?.Error?.Message ?? "Failed to upload an image", 400);
                    }

                    banner.Url = uploadResult.SecureUrl.AbsoluteUri;

                    banner.PublicId = uploadResult.PublicId;
                }

                banner.ModifiedAt = DateTime.UtcNow;
                banner.ModifiedBy = contextAccessor?.HttpContext?.User?.Identity?.Name ?? "System";
                banner.IsActive = true;

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update Banner", 400);
            }
        }
    }
}