using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<MultiImage> MultiImages { get; set; }
        public DbSet<UserPhoto> UserPhotos { get; set; }
        public DbSet<User> UserAccounts { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<WebInfo> WebInfos { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<BannerCategory> BannerCategories { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<ContentImage> ContentImages { get; set; }
        public DbSet<Content> Contents { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Product>()
                .HasMany(p => p.MultiImages)
                .WithOne(mi => mi.Product)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole { Id = "e069461a-10cf-4abf-9930-d070b2a7e40f", Name = "Member", NormalizedName = "MEMBER" },
                    new IdentityRole { Id = "a587563a-444d-4c6d-b539-a00d0c410b58", Name = "Manager", NormalizedName = "MANAGER" },
                    new IdentityRole { Id = "ed2e9149-fa53-484c-a93f-bd33f9e9fcf6", Name = "Admin", NormalizedName = "ADMIN" }
           );
        }
    }

}