using Application.BannerCategories.DTOs;
using Application.Banners.DTOs;
using Application.Contacts.DTOs;
using Application.Features.Artists.DTOs;
using Application.Features.Contents.DTOs;
using Application.Menus.Command;
using Application.Menus.DTOs;
using Application.Products.DTOs;
using Application.WebInfos.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.MultiImages, opt => opt.MapFrom(src => src.MultiImages));
            CreateMap<CreateProductDto, Product>()
                .ForMember(dest => dest.Slug, opt => opt.Ignore())
                .ForMember(dest => dest.MultiImages, opt => opt.Ignore());
            CreateMap<UpdateProductDto, Product>()
                .ForMember(dest => dest.Slug, opt => opt.Ignore())
                .ForMember(dest => dest.MultiImages, opt => opt.Ignore());

            CreateMap<MenuDto, Menu>()
             .ForMember(dest => dest.Id, opt => opt.Ignore())
             .ForMember(dest => dest.ParentId, opt => opt.Ignore());
            CreateMap<Menu, MenuDto>().ReverseMap();
            CreateMap<Menu, UpdateMenuDto>().ReverseMap();
            CreateMap<Menu, CreateMenuDto>().ReverseMap();

            CreateMap<WebInfo, WebInfoDto>().ReverseMap();

            CreateMap<Contact, ContactDto>().ReverseMap();
            CreateMap<CreateContactDto, Contact>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.ResolveDate, opt => opt.Ignore());

            CreateMap<BannerCategory, BannerCategoriesDto>().ReverseMap();
            CreateMap<CreateBannerCategoriesDto, BannerCategory>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<BannerCategory, UpdateBannerCategoriesDto>().ReverseMap();

            CreateMap<Banner, BannerDto>().ReverseMap();
            CreateMap<CreateBannerDto, Banner>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.ModifiedAt, opt => opt.Ignore())
                .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
                .ForMember(dest => dest.BannerCategory, opt => opt.Ignore());

            CreateMap<UpdateBannerDto, Banner>()
              .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.ModifiedAt, opt => opt.Ignore())
                .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
                .ForMember(dest => dest.BannerCategory, opt => opt.Ignore())
                .ForMember(dest => dest.Url, opt => opt.Ignore())
                .ForMember(dest => dest.PublicId, opt => opt.Ignore());
            CreateMap<Banner, UpdateBannerDto>();

            CreateMap<Artist, ArtistDto>().ReverseMap();
            CreateMap<CreateArtistDto, Artist>().ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<Content, ContentDto>()
                .ForMember(dest => dest.ContentImages, opt => opt.MapFrom(src => src.ContentImages.OrderBy(p => p.Order)));
            CreateMap<CreateContentDto, Content>()
                .ForMember(dest => dest.Slug, opt => opt.Ignore())
                .ForMember(dest => dest.ContentImages, opt => opt.Ignore());
            CreateMap<UpdateContentDto, Content>()
                .ForMember(dest => dest.Slug, opt => opt.Ignore())
                .ForMember(dest => dest.ContentImages, opt => opt.Ignore());
        }
    }
}