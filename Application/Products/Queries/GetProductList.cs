using Application.Core;
using Application.Products.DTOs;
using Application.Products.Extensions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Products.Queries
{
    public class GetProductList
    {
        public class Query : IRequest<Result<PagedList<ProductDto>>>
        {
            public required ProductParams Params { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<PagedList<ProductDto>>>
        {
            public async Task<Result<PagedList<ProductDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Products
                    .Sort(request.Params.OrderBy)
                    .Search(request.Params.SearchTerm)
                    .Filter(request.Params.Brands, request.Params.Types)
                    .AsQueryable();

                var products = await PagedList<ProductDto>.ToPagedList(
                    query.ProjectTo<ProductDto>(mapper.ConfigurationProvider),
                    request.Params.PageNumber, request.Params.PageSize);

                return Result<PagedList<ProductDto>>.Success(products);

            }
        }
    }
}