using Application.Contacts.Command;
using FluentValidation;

namespace Application.Contacts.validators
{
    public class CreateContactValidator : AbstractValidator<CreateContact.Command>
    {
        public CreateContactValidator()
        {
            RuleFor(x => x.ContactDto.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.ContactDto.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.ContactDto.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.ContactDto.Email))
                .WithMessage("Invalid email format.");
           
        }
    }

}