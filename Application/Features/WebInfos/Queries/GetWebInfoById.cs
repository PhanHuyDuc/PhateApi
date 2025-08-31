using Application.Core;
using Application.WebInfos.DTOs;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Features.WebInfos.Queries
{
    public class GetWebInfoById
    {
        public class Query : IRequest<Result<WebInfoDto>>
        {
            public int Id { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<WebInfoDto>>
        {
            public async Task<Result<WebInfoDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var webInfo = await context.WebInfos.FindAsync([request.Id], cancellationToken);
                if (webInfo == null) return Result<WebInfoDto>.Failure("WebInfo not found", 404);
                var webInfoDto = mapper.Map<WebInfoDto>(webInfo);
                return Result<WebInfoDto>.Success(webInfoDto);

            }
        }
    }
}