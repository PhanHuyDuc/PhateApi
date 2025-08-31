using API.Extenstions;
using Application.BannerCategories.Command;
using Application.BannerCategories.DTOs;
using Application.BannerCategories.Queries;
using Application.Menus.Command;
using Application.Utility;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BannerCategoriesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetBannerCategories([FromQuery] BannerCategoryParams param)
        {
            var result = await Mediator.Send(new GetBannerCategoryList.Query() { Params = param });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }

        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost]
        public async Task<ActionResult> CreateBannerCategory([FromBody] CreateBannerCategoriesDto bannerCategory)
        {
            return HandleResult(await Mediator.Send(new CreateBannerCategory.Command { BannerCategory = bannerCategory }));
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBannerCategory(Guid id, [FromBody] UpdateBannerCategoriesDto bannerCategory)
        {
            bannerCategory.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != bannerCategory.Id) return BadRequest("Mismatched Banner Category ID");

            return HandleResult(await Mediator.Send(new UpdateBannerCategory.Command { BannerCatDto = bannerCategory }));
        }

        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBannerCategory(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteBannerCategory.Command { Id = id }));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetBannerCategoryById(Guid id)
        {
            return HandleResult(await Mediator.Send(new GetBannerCategoryById.Query { Id = id }));
        }
    }
}