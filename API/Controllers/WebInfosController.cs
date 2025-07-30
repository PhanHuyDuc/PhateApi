using Application.WebInfos.Command;
using Application.WebInfos.DTOs;
using Application.WebInfos.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class WebInfosController : BaseApiController
    {
        [Authorize(Roles = "Admin,Manager")]
        [HttpGet]
        public async Task<IActionResult> GetWebInfoList()
        {
            return HandleResult(await Mediator.Send(new GetWebInfoList.Query()));
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateWebInfo([FromBody] WebInfoDto webInfoDto)
        {
            var result = await Mediator.Send(new CreateWebInfo.Command { webInfoDto = webInfoDto });
            return HandleResult(result);
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWebInfo(int id, [FromBody] WebInfoDto webInfoDto)
        {
            webInfoDto.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != webInfoDto.Id) return BadRequest("Web Info ID mismatch");
            var result = await Mediator.Send(new UpdateWebInfo.Command { webInfoDto = webInfoDto });
            return HandleResult(result);
        }
    }
}