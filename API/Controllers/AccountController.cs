using Application.Users.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class AccountController(SignInManager<User> signInManager) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                Bio = registerDto.Bio,
                PictureUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);
            var roleResult = await signInManager.UserManager.AddToRoleAsync(user, "Member");

            if (result.Succeeded && roleResult.Succeeded) return Ok();

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        [HttpPost("register-manager")]
        public async Task<ActionResult> RegisterManager(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                Bio = registerDto.Bio,
                PictureUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);
            var roleResult = await signInManager.UserManager.AddToRoleAsync(user, "Manager");

            if (result.Succeeded && roleResult.Succeeded) return Ok();

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            var roles = await signInManager.UserManager.GetRolesAsync(user);
            return Ok(new
            {
                user.DisplayName,
                user.Email,
                user.Id,
                user.PictureUrl,
                user.Bio,
                Roles = roles
            });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return NoContent();
        }
    }
}