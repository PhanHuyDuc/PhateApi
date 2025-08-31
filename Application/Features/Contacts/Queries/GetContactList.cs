using Application.Contacts.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Contacts.Queries
{
    public class GetContactList
    {
        public class Query : IRequest<Result<List<ContactDto>>>
        {
            // This class can be extended with parameters for filtering, sorting, etc.
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<List<ContactDto>>>
        {
            public async Task<Result<List<ContactDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var contacts = await context.Contacts
                    .ProjectTo<ContactDto>(mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                if (!contacts.Any()) return Result<List<ContactDto>>.Failure("No menus found", 404);

                return Result<List<ContactDto>>.Success(contacts);
            }
        }
    }
}