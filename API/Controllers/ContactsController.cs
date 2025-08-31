using API.Extenstions;
using Application.Contacts.Command;
using Application.Contacts.DTOs;
using Application.Contacts.Queries;
using Application.Features.Contacts.Queries;
using Application.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ContactsController : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateContact([FromBody] CreateContactDto contactDto)
        {
            var result = await Mediator.Send(new CreateContact.Command { ContactDto = contactDto });
            return HandleResult(result);
        }

        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            return HandleResult(await Mediator.Send(new GetContactList.Query()));
        }

        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAdminContacts([FromQuery] ContactParams contactParams)
        {
            var result = await Mediator.Send(new GetAdminContactList.Query { Params = contactParams });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }

        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost("resolve/{id}")]
        public async Task<IActionResult> ResolveContact(int id)
        {
            return HandleResult(await Mediator.Send(new ResolveContact.Command { Id = id }));
        }
    }
}