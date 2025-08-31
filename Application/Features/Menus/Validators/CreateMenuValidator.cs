using Application.Menus.Command;
using FluentValidation;

namespace Application.Menus.Validators
{
    public class CreateMenuValidator : AbstractValidator<CreateMenu.Command>
    {
        public CreateMenuValidator()
        {
            RuleFor(x => x.MenuDto.Name).NotEmpty().WithMessage("Menu name is required.");
            RuleFor(x => x.MenuDto.Type).NotEmpty().WithMessage("Menu Type is required.");
            RuleFor(x => x.MenuDto.Url).NotEmpty().WithMessage("Menu URL is required.");
            RuleFor(x => x.MenuDto.Order).GreaterThan(0).WithMessage("Menu order must be greater than zero.");

        }
    }

}