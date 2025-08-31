using API.Extenstions;
using Application.Core;
using Application.Features.Contents.Commands;
using Application.Features.Contents.DTOs;
using Application.Features.Contents.Queries;
using Application.Utility;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ContentsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PagedList<ContentDto>>> GetContents([FromQuery] ContentParams Params)
        {
            var result = await Mediator.Send(new GetContentList.Query { Params = Params });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }
        [HttpGet("{slug}")]
        public async Task<ActionResult<ContentDto>> GetContent(string slug)
        {
            var result = await Mediator.Send(new GetContentDetails.Query { Slug = slug });
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPost]
        public async Task<ActionResult<Content>> CreateContent([FromForm] CreateContentDto contentDto, [FromForm] IFormFileCollection? contentImages)
        {
            var result = await Mediator.Send(new CreateContent.Command
            {
                ContentDto = contentDto,
                ContentImages = contentImages
            });
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateContent(Guid id, [FromForm] UpdateContentDto contentDto, [FromForm] IFormFileCollection? contentImages)
        {
            contentDto.Id = id; // Ensure the ID in the DTO matches the route parameter
            if (id != contentDto.Id) return BadRequest("Content ID mismatch");
            var result = await Mediator.Send(new UpdateContent.Command
            {
                ContentDto = contentDto,
                ContentImages = contentImages
            });
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin_Manager)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContent(Guid id)
        {
            var result = await Mediator.Send(new DeleteContent.Command { Id = id });
            return HandleResult(result);
        }

    }
}