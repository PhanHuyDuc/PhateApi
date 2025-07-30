using API.Middleware;
using Application.Core;
using Application.Interfaces;
using Application.Menus.Validators;
using Application.Products.Queries;
using Application.Products.Validators;
using Domain;
using FluentValidation;
using Infrastructure.Photos;
using Microsoft.AspNetCore.Identity;
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
builder.Services.AddTransient<ExceptionMiddleware>();


builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration
    .GetSection("Cloudinary"));
var app = builder.Build();

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000", "https://localhost:3000"));


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
