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
    public class CreateProduct
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateProductDto ProductDto { get; set; }
            public required IFormFileCollection? MultiImages { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService) : IRequestHandler<Command, Result<string>>
        {
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var product = mapper.Map<Product>(request.ProductDto);

                if (request.MultiImages != null && request.MultiImages.Count > 0)
                {
                    bool isMainSet = true;
                    foreach (var file in request.MultiImages)
                    {
                        var uploadResult = await imageService.UploadImage(file);
                        // Check if the upload was failed
                        if (uploadResult == null || uploadResult.Error != null)
                        {
                            return Result<string>.Failure(
                            uploadResult?.Error?.Message ?? "Failed to upload an image",
                            400
                        );
                        }
                        // Create MultiImage entity
                        var multiImage = new MultiImage
                        {
                            Url = uploadResult.SecureUrl.AbsoluteUri,
                            PublicId = uploadResult.PublicId,
                            Product = product, // Associate with product
                            IsMain = isMainSet
                        };

                        product.MultiImages.Add(multiImage);
                        isMainSet = false; // Only the first image will be set as main
                    }
                }
                // Generate slug for the product
                product.Slug = request.ProductDto.Name.GenerateSlug(context.Products);
                context.Products.Add(product);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                 ? Result<string>.Success($"Create product success, Id: {product.Id}")
                 : Result<string>.Failure("Failed to create product", 400);
            }
        }
    }
}