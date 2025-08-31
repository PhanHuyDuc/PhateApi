using Application.Contacts.DTOs;
using Application.Core;
using Application.Features.Contacts.Extensions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Features.Contacts.Queries
{
    public class GetAdminContactList
    {
        public class Query : IRequest<Result<PagedList<ContactDto>>>
        {
            public required ContactParams Params { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<ContactDto>>>
        {
            public async Task<Result<PagedList<ContactDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Contacts.OrderByDescending(x => x.CreatedAt).Search(request.Params.SearchTerm).AsQueryable();

                var result = await PagedList<ContactDto>.ToPagedList(query.ProjectTo<ContactDto>(mapper.ConfigurationProvider),
                                request.Params.PageNumber, request.Params.PageSize);
                if (!result.Any()) return Result<PagedList<ContactDto>>.Failure("No contacts found", 404);

                return Result<PagedList<ContactDto>>.Success(result);
            }
        }
    }
}