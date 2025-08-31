using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IMultiImageService
    {
        Task<UploadResult?> UploadImage(IFormFile file);
        Task<UploadResult?> UploadContentImage(IFormFile file);
        Task<DeletionResult> DeleteImage(string publicId);
    }
}