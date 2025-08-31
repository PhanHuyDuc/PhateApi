using Application.Core;
using Application.Features.Contents.DTOs;
using Application.Features.Contents.Extensions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Features.Contents.Queries
{
    public class GetContentList
    {
        public class Query : IRequest<Result<PagedList<ContentDto>>>
        {
            public required ContentParams Params { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<ContentDto>>>
        {
            public async Task<Result<PagedList<ContentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Contents
                    .Sort(request.Params.OrderBy)
                    .Search(request.Params.SearchTerm)
                    .Filter(request.Params.Tag)
                    .AsQueryable();

                var contents = await PagedList<ContentDto>.ToPagedList(
                    query.ProjectTo<ContentDto>(mapper.ConfigurationProvider),
                    request.Params.PageNumber, request.Params.PageSize);

                return Result<PagedList<ContentDto>>.Success(contents);

            }
        }
    }
}