using Application.Banners.Commands;
using FluentValidation;

namespace Application.Banners.Validators
{
    public class CreateBannerValidator : AbstractValidator<CreateBanner.Command>
    {
        public CreateBannerValidator()
        {
            RuleFor(x => x.BannerDto.Title).NotEmpty().WithMessage("Banner name is required.");
            RuleFor(x => x.BannerDto.Description).NotEmpty().WithMessage("Banner description is required.");
            RuleFor(x => x.BannerDto.File).NotEmpty().WithMessage("Image is required.");
        }
    }

}