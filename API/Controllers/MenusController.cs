using API.Extenstions;
using Application.Features.Menus.Queries;
using Application.Menus.Command;
using Application.Menus.DTOs;
using Application.Menus.Queries;
using Application.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MenusController : BaseApiController
    {
        [HttpGet("GetAdminMenu")]

        public async Task<IActionResult> GetMenuList([FromQuery] MenuParams menuParams)
        {
            var result = await Mediator.Send(new GetMenuList.Query() { Params = menuParams });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllMenuList()
        {
            var result = await Mediator.Send(new GetAllMenu.Query());
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuDto menuDto)
        {
            var result = await Mediator.Send(new CreateMenu.Command
            {
                MenuDto = menuDto
            });
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] UpdateMenuDto menuDto)
        {
            menuDto.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != menuDto.Id) return BadRequest("Menu ID mismatch");
            var result = await Mediator.Send(new UpdateMenu.Command { MenuDto = menuDto });
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id)
        {
            var result = await Mediator.Send(new DeleteMenu.Command { Id = id });
            return HandleResult(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMenuById(int id)
        {
            return HandleResult(await Mediator.Send(new GetMenuById.Query { Id = id }));
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost("toggle-active/{id}")]
        public async Task<IActionResult> ToggleActiveMenu(int id)
        {
            var result = await Mediator.Send(new ToggleActiveMenu.Command { Id = id });
            return HandleResult(result);
        }

    }
}