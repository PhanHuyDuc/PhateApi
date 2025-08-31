using Application.Core;
using Application.Features.Artists.DTOs;
using Application.Features.Artists.Extensions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Persistence;

namespace Application.Features.Artists.Queries
{
    public class GetArtistList
    {
        public class Query : IRequest<Result<PagedList<ArtistDto>>>
        {
            public required ArtistParams Params { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<ArtistDto>>>
        {
            public async Task<Result<PagedList<ArtistDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Artists
                                    .Sort(request.Params.OrderBy)
                                    .Search(request.Params.SearchTerm)
                                    .AsQueryable();
                var banners = await PagedList<ArtistDto>.ToPagedList(
                    query.ProjectTo<ArtistDto>(mapper.ConfigurationProvider),
                    request.Params.PageNumber, request.Params.PageSize);

                return Result<PagedList<ArtistDto>>.Success(banners);
            }
        }
    }
}