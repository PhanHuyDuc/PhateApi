using Application.Contacts.DTOs;
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
        }
    }
}