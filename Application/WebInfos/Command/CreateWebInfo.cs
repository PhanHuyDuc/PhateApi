using Application.Core;
using Application.WebInfos.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.WebInfos.Command
{
    public class CreateWebInfo
    {
        public class Command : IRequest<Result<string>>
        {
            public required WebInfoDto webInfoDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var webInfo = mapper.Map<WebInfo>(request.webInfoDto);
                context.WebInfos.Add(webInfo);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<string>.Success($"Create WebInfo Success, Id:{webInfo.Id} ") : Result<string>.Failure("Failed to create web information", 400);
            }
        }
    }
}