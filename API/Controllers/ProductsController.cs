using API.Extenstions;
using Application.Core;
using Application.Products.Commands;
using Application.Products.DTOs;
using Application.Products.Queries;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var result = await Mediator.Send(new GetProductList.Query { Params = productParams });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var result = await Mediator.Send(new GetProductDetails.Query { Id = id });
            return HandleResult(result);
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto, [FromForm] IFormFileCollection? multiImages)
        {
            var result = await Mediator.Send(new CreateProduct.Command
            {
                ProductDto = productDto,
                MultiImages = multiImages
            });
            return HandleResult(result);
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto productDto, [FromForm] IFormFileCollection? multiImages)
        {
            productDto.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != productDto.Id) return BadRequest("Product ID mismatch");
            var result = await Mediator.Send(new UpdateProduct.Command
            {
                ProductDto = productDto,
                MultiImages = multiImages
            });
            return HandleResult(result);
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var result = await Mediator.Send(new DeleteProduct.Command { Id = id });
            return HandleResult(result);
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpDelete("image/{imagePublicId}")]
        public async Task<ActionResult> DeleteImageProduct(string imagePublicId)
        {
            var result = await Mediator.Send(new DeleteImageProduct.Command { ImagePublicId = imagePublicId });
            return HandleResult(result);
        }
    }
}