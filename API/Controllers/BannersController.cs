using API.Extenstions;
using Application.Banners.Commands;
using Application.Banners.DTOs;
using Application.Banners.Queries;
using Application.Core;
using Application.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BannersController : BaseApiController
    {
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost]
        public async Task<ActionResult> CreateBanner([FromForm] CreateBannerDto bannerDto)
        {
            return HandleResult(await Mediator.Send(new CreateBanner.Command { BannerDto = bannerDto }));
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBanner(Guid id, [FromForm] UpdateBannerDto bannerDto)
        {
            bannerDto.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != bannerDto.Id) return BadRequest("Banner ID mismatch");
            return HandleResult(await Mediator.Send(new UpdateBanner.Command { BannerDto = bannerDto }));
        }
        [HttpGet]
        public async Task<ActionResult<PagedList<BannerDto>>> GetBanners([FromQuery] BannerParams bannerParams)
        {
            var result = await Mediator.Send(new GetBannerList.Query { Params = bannerParams });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBanner(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteBanner.Command { Id = id }));
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost("toggle-active/{id}")]
        public async Task<ActionResult> ToggleActiveBanner(Guid id)
        {
            return HandleResult(await Mediator.Send(new ToggleActiveBanner.Command { Id = id }));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<BannerDto>> GetBannerById(Guid id)
        {
            return HandleResult(await Mediator.Send(new GetBannerById.Query { Id = id }));
        }
    }
}