using Application.Contacts.Command;
using Application.Contacts.DTOs;
using Application.Contacts.Queries;
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
        [Authorize(Roles = "Admin, Manager")]
        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            return HandleResult(await Mediator.Send(new GetContactList.Query()));
        }
        [Authorize(Roles = "Admin, Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> ResolveContact(int id)
        {
            return HandleResult(await Mediator.Send(new ResolveContact.Command { Id = id }));
        }
    }
}