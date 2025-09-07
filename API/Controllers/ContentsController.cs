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
        [Authorize(Roles = SD.Role_Admin)]
        [HttpGet]
        public async Task<ActionResult<PagedList<ContentDto>>> GetContents([FromQuery] ContentParams Params)
        {
            var result = await Mediator.Send(new GetContentList.Query { Params = Params });
            Response.AddPaginationHeader(result.Value?.Metadata!);
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin)]
        [HttpGet("{slug}")]
        public async Task<ActionResult<ContentDto>> GetContent(string slug)
        {
            var result = await Mediator.Send(new GetContentDetails.Query { Slug = slug });
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin)]
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
        [Authorize(Roles = SD.Role_Admin)]
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
        [Authorize(Roles = SD.Role_Admin)]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContent(Guid id)
        {
            var result = await Mediator.Send(new DeleteContent.Command { Id = id });
            return HandleResult(result);
        }
        [Authorize(Roles = SD.Role_Admin)]
        [HttpPost("{id}/images")]
        public async Task<ActionResult> AppendContentImages(Guid id, [FromForm] IFormFileCollection contentImages)
        {
            var result = await Mediator.Send(new AppendContentImages.Command
            {
                ContentId = id,
                ContentImages = contentImages
            });
            return HandleResult(result);
        }
    }
}