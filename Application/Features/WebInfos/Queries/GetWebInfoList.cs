using Application.Core;
using Application.WebInfos.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.WebInfos.Queries
{
    public class GetWebInfoList
    {
        public class Query : IRequest<Result<List<WebInfoDto>>>
        {
            // This class can be extended with parameters if needed in the future
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<List<WebInfoDto>>>
        {
            public async Task<Result<List<WebInfoDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var webInfos = await context.WebInfos.ToListAsync(cancellationToken);
                if (webInfos == null || !webInfos.Any())
                {
                    return Result<List<WebInfoDto>>.Failure("No web information found", 404);
                }

                var webInfoDtos = mapper.Map<List<WebInfoDto>>(webInfos);
                return Result<List<WebInfoDto>>.Success(webInfoDtos);
            }
        }
    }
}