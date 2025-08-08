using Application.Contacts.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Contacts.Command
{
    public class CreateContact
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateContactDto ContactDto { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var contact = mapper.Map<Contact>(request.ContactDto);
                contact.CreatedAt = DateTime.Now;

                context.Contacts.Add(contact);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                if (result) return Result<string>.Success(mapper.Map<string>(contact));

                return Result<string>.Failure($"Failed to create contact", 400);
            }
        }
    }
}