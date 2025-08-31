using Application.Core;
using Application.WebInfos.DTOs;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.WebInfos.Command
{
    public class UpdateWebInfo
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required WebInfoDto webInfoDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var webInfo = await context.WebInfos.FindAsync(request.webInfoDto.Id);
                if (webInfo == null) return Result<Unit>.Failure("Web information not found", 404);

                mapper.Map(request.webInfoDto, webInfo);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update web information", 400);
            }
        }
    }
}