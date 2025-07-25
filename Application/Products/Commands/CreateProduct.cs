using Application.Core;
using Application.Products.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Products.Commands
{
    public class CreateProduct
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateProductDto ProductDto { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var product = mapper.Map<Product>(request.ProductDto);
                context.Products.Add(product);
                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                if (!result)
                {
                    return Result<string>.Failure("Failed to create product", 400);
                }

                return Result<string>.Success("Create product success, Id: " + product.Id.ToString());
            }
        }
    }
}