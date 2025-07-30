using Application.Menus.Command;
using Application.Menus.DTOs;
using Application.Menus.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MenusController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetMenuList()
        {
            return HandleResult(await Mediator.Send(new GetMenuList.Query()));
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuDto menuDto)
        {
            var result = await Mediator.Send(new CreateMenu.Command
            {
                MenuDto = menuDto
            });
            return HandleResult(result);
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] UpdateMenuDto menuDto)
        {
            menuDto.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != menuDto.Id) return BadRequest("Menu ID mismatch");
            var result = await Mediator.Send(new UpdateMenu.Command { MenuDto = menuDto });
            return HandleResult(result);
        }
        [Authorize(Roles = "Admin,Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id)
        {
            var result = await Mediator.Send(new DeleteMenu.Command { Id = id });
            return HandleResult(result);
        }
    }
}