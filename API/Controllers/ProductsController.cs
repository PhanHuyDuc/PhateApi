using API.Extenstions;
using Application.Core;
using Application.Products.DTOs;
using Application.Products.Queries;
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
    }
}