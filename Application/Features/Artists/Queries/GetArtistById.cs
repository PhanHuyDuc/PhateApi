using Application.Core;
using Application.Features.Artists.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Artists.Queries
{
    public class GetArtistById
    {
        public class Query : IRequest<Result<ArtistDto>>
        {
            public required Guid Id { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<ArtistDto>>
        {
            public async Task<Result<ArtistDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var artist = await context.Artists
                    .ProjectTo<ArtistDto>(mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

                if (artist == null) return Result<ArtistDto>.Failure("Artist not found", 404);

                return Result<ArtistDto>.Success(artist);
            }
        }
    }
}