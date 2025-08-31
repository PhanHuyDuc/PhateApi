using Application.BannerCategories.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.BannerCategories.Command
{
    public class CreateBannerCategory
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateBannerCategoriesDto BannerCategory { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<string>>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(AppDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _mapper = mapper;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var bannerCategory = _mapper.Map<BannerCategory>(request.BannerCategory);
                bannerCategory.CreatedAt = DateTime.UtcNow;
                bannerCategory.CreatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
                _context.BannerCategories.Add(bannerCategory);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<string>.Success("Banner category created successfully") : Result<string>.Failure("Failed to create banner category", 400);
            }
        }
    }
}