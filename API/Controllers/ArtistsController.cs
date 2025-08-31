using API.Extenstions;
using Application.Features.Artists.Command;
using Application.Features.Artists.DTOs;
using Application.Features.Artists.Queries;
using Application.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ArtistsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetArtist([FromQuery] ArtistParams param)
        {
            var result = await Mediator.Send(new GetArtistList.Query() { Params = param });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }

        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost]
        public async Task<ActionResult> CreateArtist([FromBody] CreateArtistDto artistDto)
        {
            return HandleResult(await Mediator.Send(new CreateArtist.Command { ArtistDto = artistDto }));
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateArtist(Guid id, [FromBody] ArtistDto artistDto)
        {
            artistDto.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != artistDto.Id) return BadRequest("Mismatched Artist ID");

            return HandleResult(await Mediator.Send(new UpdateArtist.Command { artistDto = artistDto }));
        }

        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteArtist(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteArtist.Command { Id = id }));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> GetArtistById(Guid id)
        {
            return HandleResult(await Mediator.Send(new GetArtistById.Query { Id = id }));
        }

    }
}