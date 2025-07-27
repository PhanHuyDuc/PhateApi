using Application.Products.DTOs;
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
        }
    }
}