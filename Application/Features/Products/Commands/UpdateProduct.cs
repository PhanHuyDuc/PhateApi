using Application.Core;
using Application.Interfaces;
using Application.Products.DTOs;
using Application.Products.Extensions;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Products.Commands
{
    public class UpdateProduct
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required UpdateProductDto ProductDto { get; set; }
            public required IFormFileCollection? MultiImages { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var product = await context.Products.FindAsync([request.ProductDto.Id], cancellationToken);
                if (product == null) return Result<Unit>.Failure("Product not found", 404);
                product.Slug = request.ProductDto.Name.GenerateSlug(context.Products);
                mapper.Map(request.ProductDto, product);

                if (request.MultiImages != null && request.MultiImages.Count > 0)
                {

                    foreach (var file in request.MultiImages)
                    {
                        var uploadResult = await imageService.UploadImage(file);
                        if (uploadResult == null || uploadResult.Error != null)
                        {
                            return Result<Unit>.Failure(uploadResult?.Error?.Message ?? "Failed to upload an image", 400);
                        }
                        var multiImage = new MultiImage
                        {
                            Url = uploadResult.SecureUrl.AbsoluteUri,
                            PublicId = uploadResult.PublicId,
                            Product = product,
                        };
                        product.MultiImages.Add(multiImage);
                    }
                }
                product.ModifiedAt = DateTime.UtcNow;
                product.ModifiedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "System";

                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update product", 400);
            }
        }
    }
}