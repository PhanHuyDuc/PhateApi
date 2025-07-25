using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DbInitializer
    {
        public static async Task SeedData(AppDbContext context, UserManager<User> userManager)
        {

            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "member@flounderfantasy.com",
                    Email = "member@flounderfantasy.com",
                    DisplayName = "Member Flounder",
                    Bio = "Female",
                    PictureUrl = "https://cdn.pixabay.com/photo/2023/09/26/19/57/artistic-nude-8278143_640.png"
                };

                await userManager.CreateAsync(user, "Password@123");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin@flounderfantasy.com",
                    Email = "admin@flounderfantasy.com",
                    DisplayName = "Admin Flounder",
                    Bio = "Female",
                    PictureUrl = "https://cdn.hentaicube.xyz/ext/2022/6/3/vao-nhung-ngay-oi-a/7/000.webp"
                };

                await userManager.CreateAsync(admin, "Password@123");
                await userManager.AddToRolesAsync(admin, ["Member", "Manager", "Admin"]);

                var manager = new User
                {
                    UserName = "manager@flounderfantasy.com",
                    Email = "manager@flounderfantasy.com",
                    DisplayName = "Member Flounder",
                    Bio = "Female",
                    PictureUrl = "https://i.hentaifox.com/003/2019342/1t.jpg"
                };

                await userManager.CreateAsync(manager, "Password@123");
                await userManager.AddToRolesAsync(manager, ["Member", "Manager"]);
            }

            if (context.Products.Any()) return;
            var products = new List<Product>
            {
              new (){

                Name = "Black Coffee Flounder",
                Description = "A fantasy coffee featuring flounders.",
                Price = 40000,
                SaleOff = 20000,
                ShortDescription = "Fantasy coffee with flounders",
                Type = "Coffee",
                Brand = "Daily Coffee",
                QuantityInStock = 100,
                MultiImages = new List<MultiImage>
                {
                    new MultiImage
                     {
                        Url = "https://cdn.pixabay.com/photo/2020/03/28/14/38/egg-coffee-4977310_1280.jpg" ,
                        PublicId = "image1_public_id" ,
                        IsMain = true ,
                        ProductId = 1
                     },
                    new MultiImage
                     {
                        Url = "https://cdn.pixabay.com/photo/2020/03/04/03/36/capuchino-4900421_1280.jpg" ,
                        PublicId = "image1_public_id" ,
                        IsMain = false,
                        ProductId = 1
                     },
                }
              },
              new (){
                Name = "Soda Flounder",
                Description = "A fantasy soda featuring flounders.",
                Price = 40000,
                SaleOff = 20000,
                ShortDescription = "Fantasy soda with flounders",
                Type = "Soda",
                Brand = "Daily Coffee",
                QuantityInStock = 100,
                MultiImages = new List<MultiImage>
                {
                    new MultiImage
                     {
                        Url = "https://cdn.pixabay.com/photo/2019/08/26/08/30/melon-soda-4431112_1280.jpg" ,
                        PublicId = "image2_public_id" ,
                        IsMain = true
                     },
                    new MultiImage
                     {
                        Url = "https://cdn.pixabay.com/photo/2018/11/02/03/57/restaurant-3789562_1280.jpg" ,
                        PublicId = "image2_public_id" ,
                        IsMain = false
                     },
                }
              }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();

        }
    }
}