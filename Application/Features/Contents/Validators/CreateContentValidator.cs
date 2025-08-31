using Application.Features.Contents.Commands;
using FluentValidation;

namespace Application.Features.Contents.Validators
{
    public class CreateContentValidator : AbstractValidator<CreateContent.Command>
    {
        public CreateContentValidator()
        {
            RuleFor(x => x.ContentDto.Name).NotEmpty().WithMessage("Name is required");
            RuleFor(x => x.ContentDto.Description).NotEmpty().WithMessage("Description is required");
            RuleFor(x => x.ContentDto.Artist).NotEmpty().WithMessage("Artist is required");
            RuleFor(x => x.ContentDto.Tag).NotEmpty().WithMessage("Tag is required");
            RuleFor(x => x.ContentImages)
           .NotNull()
           .WithMessage("At least one image is required.")
           .Must(images => images != null && images.Any(file => file != null && file.Length > 0))
           .WithMessage("At least one valid image file is required.");
        }

    }
}