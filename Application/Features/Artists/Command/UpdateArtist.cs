using Application.Core;
using Application.Features.Artists.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Features.Artists.Command
{
    public class UpdateArtist
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required ArtistDto artistDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var artist = await context.Artists.FindAsync([request.artistDto.Id], cancellationToken);

                if (artist == null) return Result<Unit>.Failure("Artist not found", 404);

                mapper.Map(request.artistDto, artist);

                artist.ModifiedAt = DateTime.UtcNow;
                artist.ModifiedBy = httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "system";

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update artist", 400);
            }
        }
    }
}