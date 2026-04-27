using Application.Core;
using Application.Features.Artists.DTOs;
using Application.Features.Contents.DTOs;
using Application.Features.Contents.Extensions;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Contents.Commands
{
    public class CreateContent
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateContentDto ContentDto { get; set; }
            public required IFormFileCollection? ContentImages { get; set; }
        }
        // public class CreateContentResponse
        // {
        //     public Guid Id { get; set; }
        //     public string Message { get; set; } = string.Empty;
        // }

        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<string>>
        {
            private const int MaxRetryAttempts = 10; // e.g., retry up to 10 times
            private const int InitialRetryDelayMs = 30000; // 30 seconds initial delay
            private const int MaxRetryDelayMs = 60000; // 1 minute max delay

            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {


                var uploadedImages = new List<(string Url, string PublicId, int Order, bool IsMain)>();

                if (request.ContentImages != null && request.ContentImages.Count > 0)
                {
                    bool isMainSet = true;
                    int sequentialOrder = 1;

                    foreach (var file in request.ContentImages)
                    {
                        // Extract order from file name (e.g., "1.webp" -> 1)
                        string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        int order = sequentialOrder;
                        if (int.TryParse(fileName, out int parsedOrder))
                        {
                            order = parsedOrder;
                        }
                        else
                        {
                            sequentialOrder++; // Increment for next fallback
                        }

                        // Retry logic for upload
                        CloudinaryDotNet.Actions.UploadResult? uploadResult = null;
                        int attempt = 0;
                        bool success = false;
                        int currentDelay = InitialRetryDelayMs;

                        while (attempt < MaxRetryAttempts && !success)
                        {
                            try
                            {
                                uploadResult = await imageService.UploadContentImage(file);
                                if (uploadResult != null && uploadResult.Error == null)
                                {
                                    success = true;
                                }
                                else
                                {
                                    attempt++;
                                    if (attempt < MaxRetryAttempts)
                                    {
                                        // Exponential backoff with jitter
                                        int jitter = new Random().Next(-5000, 5000); // +/- 5 seconds jitter
                                        await Task.Delay(currentDelay + jitter, cancellationToken);
                                        currentDelay = Math.Min(currentDelay * 2, MaxRetryDelayMs); // Double delay, cap at max
                                    }
                                }
                            }
                            catch (Exception ex) // Catch network-related exceptions
                            {
                                // Assuming exceptions like HttpRequestException, TimeoutException, etc., indicate network issues
                                if (IsNetworkException(ex))
                                {
                                    attempt++;
                                    if (attempt < MaxRetryAttempts)
                                    {
                                        int jitter = new Random().Next(-5000, 5000);
                                        await Task.Delay(currentDelay + jitter, cancellationToken);
                                        currentDelay = Math.Min(currentDelay * 2, MaxRetryDelayMs);
                                    }
                                }
                                else
                                {
                                    // Non-network error, fail immediately
                                    await RollbackUploads(uploadedImages, imageService);
                                    return Result<string>.Failure(ex.Message ?? "Unexpected error during upload", 500);
                                }
                            }
                        }

                        if (!success)
                        {
                            // After retries, if still failed, rollback previous uploads
                            await RollbackUploads(uploadedImages, imageService);
                            return Result<string>.Failure(
                                uploadResult?.Error?.Message ?? "Failed to upload an image after retries",
                                400
                            );
                        }

                        // Store successful upload info
                        uploadedImages.Add((
                            uploadResult!.SecureUrl.AbsoluteUri,
                            uploadResult.PublicId,
                            order,
                            isMainSet
                        ));

                        isMainSet = false; // Only the first image will be set as main
                    }
                }



                try
                {
                    var content = mapper.Map<Content>(request.ContentDto);

                    foreach (var (Url, PublicId, Order, IsMain) in uploadedImages.OrderBy(img => img.Order))
                    {
                        content.ContentImages.Add(new ContentImage
                        {
                            Url = Url,
                            PublicId = PublicId,
                            Content = content,
                            IsMain = IsMain,
                            Order = Order
                        });
                    }

                    // Do the slug generation and metadata here
                    content.Slug = request.ContentDto.Name.GenerateSlug(context.Contents);
                    content.CreatedAt = DateTime.UtcNow;
                    content.CreatedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "system";

                    context.Contents.Add(content);
                    
                    var result = await context.SaveChangesAsync(cancellationToken) > 0;
                    if (result)
                    {
                        return Result<string>.Success("Successful Create Content: " + content.Id);
                    }
                    else
                    {
                        // If DB save fails, rollback uploads
                        await RollbackUploads(uploadedImages, imageService);
                        return Result<string>.Failure("Failed to create content", 400);
                    }
                }
                catch (Exception ex)
                {
                    // If exception during save, rollback
                    await RollbackUploads(uploadedImages, imageService);
                    return Result<string>.Failure(ex.Message ?? "Failed to save content", 500);
                }
            }

            private async Task RollbackUploads(List<(string Url, string PublicId, int Order, bool IsMain)> uploadedImages, IMultiImageService imageService)
            {
                foreach (var image in uploadedImages)
                {
                    await imageService.DeleteImage(image.PublicId);
                }
            }

            private bool IsNetworkException(Exception ex)
            {
                // Customize based on expected exceptions from Cloudinary SDK
                // For example:
                return ex is HttpRequestException || ex is TaskCanceledException || ex is TimeoutException ||
                       (ex.InnerException != null && IsNetworkException(ex.InnerException));
            }
        }
    }
}