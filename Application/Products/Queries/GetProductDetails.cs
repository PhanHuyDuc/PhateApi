using Application.Core;
using Application.Products.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products.Queries
{
    public class GetProductDetails
    {
        public class Query : IRequest<Result<ProductDto>>
        {
            public required string Slug { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<ProductDto>>
        {
            public async Task<Result<ProductDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var product = await context.Products
                    .Include(p => p.MultiImages)
                    .ProjectTo<ProductDto>(mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(p => p.Slug == request.Slug, cancellationToken);

                if (product == null) return Result<ProductDto>.Failure("Product not found", 404);

                return Result<ProductDto>.Success(product);
            }
        }
    }
}