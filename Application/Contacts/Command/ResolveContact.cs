using Application.Core;
using MediatR;
using Persistence;

namespace Application.Contacts.Command
{
    public class ResolveContact
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required int Id { get; set; }
        }
        public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var contact = await context.Contacts.FindAsync(request.Id);
                if (contact == null) return Result<Unit>.Failure("Contact not found", 404);

                contact.IsResolve = true;
                contact.ResolveDate = DateTime.Now;

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                if (result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to resolve contact", 400);
            }
        }
    }
}