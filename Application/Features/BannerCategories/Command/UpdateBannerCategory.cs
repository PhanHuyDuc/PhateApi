using Application.BannerCategories.DTOs;
using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.BannerCategories.Command
{
    public class UpdateBannerCategory
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required UpdateBannerCategoriesDto BannerCatDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var bannerCategory = await context.BannerCategories.FindAsync([request.BannerCatDto.Id], cancellationToken);

                if (bannerCategory == null) return Result<Unit>.Failure("Banner category not found", 404);

                mapper.Map(request.BannerCatDto, bannerCategory);

                bannerCategory.ModifiedAt = DateTime.UtcNow;
                bannerCategory.ModifiedBy = httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "system";

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update banner category", 400);
            }
        }
    }
}