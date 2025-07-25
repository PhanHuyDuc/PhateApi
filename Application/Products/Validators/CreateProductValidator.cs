using Application.Products.Commands;
using FluentValidation;

namespace Application.Products.Validators
{
    public class CreateProductValidator : AbstractValidator<CreateProduct.Command>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.ProductDto.Name).NotEmpty().WithMessage("Product name is required.");
            RuleFor(x => x.ProductDto.Description).NotEmpty().WithMessage("Product description is required.");
            RuleFor(x => x.ProductDto.ShortDescription).NotEmpty().WithMessage("Product short description is required.");
            RuleFor(x => x.ProductDto.Price).GreaterThan(0).WithMessage("Product price must be greater than zero.");
            RuleFor(x => x.ProductDto.Type).NotEmpty().WithMessage("Product type is required.");
            RuleFor(x => x.ProductDto.Brand).NotEmpty().WithMessage("Product brand is required.");
        }
    }

}