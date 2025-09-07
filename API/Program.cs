using API.Middleware;
using Application.BannerCategories.Validators;
using Application.Banners.Validators;
using Application.Contacts.validators;
using Application.Core;
using Application.Features.Contents.Validators;
using Application.Interfaces;
using Application.Menus.Validators;
using Application.Products.Queries;
using Application.Products.Validators;
using Domain;
using FluentValidation;
using Infrastructure.Photos;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});


builder.Services.AddCors();
builder.Services.AddMediatR(x =>
{
    x.RegisterServicesFromAssemblyContaining<GetProductList.Handler>();
    x.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

builder.Services.AddScoped<IMultiImageService, ImageService>();
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateMenuValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateContactValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateBannerCategoriesValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateBannerValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateContentValidator>();
builder.Services.AddTransient<ExceptionMiddleware>();

// Increase request body size limit
builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 500 * 1024 * 1024; // 500 MB in bytes
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 500 * 1024 * 1024; // 500 MB in bytes
    options.ValueLengthLimit = int.MaxValue; // Allow large form values
    options.MultipartHeadersLengthLimit = int.MaxValue; // Allow large headers
});

builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration
    .GetSection("Cloudinary"));
var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000", "http://localhost:5001"));


app.UseAuthentication();
app.UseAuthorization();
app.MapGroup("api").MapIdentityApi<User>(); //api/login
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AppDbContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    await context.Database.MigrateAsync();
    await DbInitializer.SeedData(context, userManager);

}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

app.Run();
