using Application.BannerCategories.DTOs;
using Application.Core;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.BannerCategories.Queries
{
    public class GetBannerCategoryById
    {
        public class Query : IRequest<Result<BannerCategoriesDto>>
        {
            public required Guid Id { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<BannerCategoriesDto>>
        {
            public async Task<Result<BannerCategoriesDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var bannerCat = await context.BannerCategories
                                          .FindAsync([request.Id], cancellationToken);

                if (bannerCat == null) return Result<BannerCategoriesDto>.Failure("Banner Category not found", 404);

                var bannerCatDto = mapper.Map<BannerCategoriesDto>(bannerCat);
                return Result<BannerCategoriesDto>.Success(bannerCatDto);
            }
        }
    }
}