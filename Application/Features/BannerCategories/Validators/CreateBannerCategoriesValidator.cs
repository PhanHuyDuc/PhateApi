using Application.BannerCategories.DTOs;
using FluentValidation;

namespace Application.BannerCategories.Validators
{
    public class CreateBannerCategoriesValidator : AbstractValidator<CreateBannerCategoriesDto>
    {
        public CreateBannerCategoriesValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Banner category name is required.");
         
        }

    }
}