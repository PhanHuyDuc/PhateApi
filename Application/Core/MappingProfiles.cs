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
                .ForMember(dest => dest.MultiImages, opt => opt.Ignore());
            CreateMap<UpdateProductDto, Product>()
                .ForMember(dest => dest.MultiImages, opt => opt.Ignore());

            CreateMap<MenuDto, Menu>()
             .ForMember(dest => dest.Id, opt => opt.Ignore())
             .ForMember(dest => dest.ParentId, opt => opt.Ignore());
            CreateMap<Menu, MenuDto>().ReverseMap();
            CreateMap<Menu, UpdateMenuDto>().ReverseMap();
            CreateMap<Menu, CreateMenuDto>().ReverseMap();

            CreateMap<WebInfo, WebInfoDto>().ReverseMap();
        }
    }
}