using Application.Interfaces;
using Application.Utility;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class ImageService : IMultiImageService
    {
        private readonly Cloudinary _cloudinary;

        public ImageService(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }
        public async Task<DeletionResult> DeleteImage(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            return await _cloudinary.DestroyAsync(deleteParams);
        }

        public async Task<UploadResult?> UploadImage(IFormFile file)
        {
            if (file.Length <= 0) return null;

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = SD.Cloudinary_Folder
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            return uploadResult;
        }
        public async Task<List<UploadResult>> UploadMultiImages(IFormFileCollection files)
        {
            var uploadResults = new List<UploadResult>();

            foreach (var file in files)
            {
                if (file.Length <= 0) continue; // Skip empty files

                await using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = SD.Cloudinary_Folder
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                uploadResults.Add(uploadResult);
            }

            return uploadResults;
        }
    }
}