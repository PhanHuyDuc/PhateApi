using Application.Banners.DTOs;
using Application.Core;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Banners.Queries
{
    public class GetBannerById
    {
        public class Query : IRequest<Result<BannerDto>>
        {
            public required Guid Id { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<BannerDto>>
        {
            public async Task<Result<BannerDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var banner = await context.Banners
                                          .FindAsync([request.Id], cancellationToken);

                if (banner == null) return Result<BannerDto>.Failure("Banner not found", 404);

                var bannerDto = mapper.Map<BannerDto>(banner);
                return Result<BannerDto>.Success(bannerDto);
            }
        }
    }
}