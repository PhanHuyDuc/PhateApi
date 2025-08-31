using Application.Core;
using Application.Features.Artists.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Features.Artists.Command
{
    public class CreateArtist
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateArtistDto ArtistDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {

                var artist = mapper.Map<Artist>(request.ArtistDto);

                artist.CreatedAt = DateTime.UtcNow;
                artist.CreatedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "System";

                context.Artists.Add(artist);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                 ? Result<string>.Success($"Create artist success, Id: {artist.Id}")
                 : Result<string>.Failure("Failed to create artist", 400);
            }
        }
    }
}