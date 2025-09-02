using Application.Core;
using Application.Banners.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Banners.Extensions;
using System.Collections.Immutable;

namespace Application.Banners.Queries
{
    public class GetBannerList
    {
        public class Query : IRequest<Result<PagedList<BannerDto>>>
        {
            public required BannerParams Params { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<BannerDto>>>
        {
            public async Task<Result<PagedList<BannerDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Banners
                                    .Sort(request.Params.OrderBy)
                                    .Search(request.Params.SearchTerm)
                                    .AsQueryable();
                var banners = await PagedList<BannerDto>.ToPagedList(
                    query.ProjectTo<BannerDto>(mapper.ConfigurationProvider),
                    request.Params.PageNumber, request.Params.PageSize);

                return Result<PagedList<BannerDto>>.Success(banners);
            }
        }
    }
}