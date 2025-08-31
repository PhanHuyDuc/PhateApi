using Application.Core;
using Application.Features.Contents.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Contents.Queries
{
    public class GetContentDetails
    {
        public class Query : IRequest<Result<ContentDto>>
        {
            public required string Slug { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<ContentDto>>
        {
            public async Task<Result<ContentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var content = await context.Contents
                    .Include(p => p.ContentImages)
                    .ProjectTo<ContentDto>(mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(p => p.Slug == request.Slug, cancellationToken);

                if (content == null) return Result<ContentDto>.Failure("Content not found", 404);

                return Result<ContentDto>.Success(content);
            }
        }
    }
}