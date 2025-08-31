using Application.BannerCategories.DTOs;
using Application.BannerCategories.Extension;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.BannerCategories.Queries
{
    public class GetBannerCategoryList
    {
        public class Query : IRequest<Result<PagedList<BannerCategoriesDto>>>
        {
            public required BannerCategoryParams Params { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<BannerCategoriesDto>>>
        {
            public async Task<Result<PagedList<BannerCategoriesDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.BannerCategories.Search(request.Params.SearchTerm).AsQueryable();

                var bannerCategories = await PagedList<BannerCategoriesDto>.ToPagedList(
                    query.ProjectTo<BannerCategoriesDto>(mapper.ConfigurationProvider),
                    request.Params.PageNumber, request.Params.PageSize);

                if (!bannerCategories.Any()) return Result<PagedList<BannerCategoriesDto>>.Failure("No banner categories found", 404);

                return Result<PagedList<BannerCategoriesDto>>.Success(bannerCategories);
            }
        }
    }
}