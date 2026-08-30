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
            public string? IdempotencyKey { get; set; }

        }
        // public class CreateContentResponse
        // {
        //     public Guid Id { get; set; }
        //     public string Message { get; set; } = string.Empty;
        // }

        public class Handler(AppDbContext context, IMapper mapper, IMultiImageService imageService, IHttpContextAccessor contextAccessor) : IRequestHandler<Command, Result<string>>
        {
            private const int MaxRetryAttempts = 5;
            private const int InitialRetryDelayMs = 5000;
            private const int MaxRetryDelayMs = 20000;
            private const int MaxConcurrentUploads = 5;


            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                // 0. Early-exit if this exact submission already succeeded
                if (!string.IsNullOrWhiteSpace(request.IdempotencyKey))
                {
                    var existing = await context.Contents
                        .FirstOrDefaultAsync(c => c.IdempotencyKey == request.IdempotencyKey, cancellationToken);

                    if (existing != null)
                    {
                        return Result<string>.Success("Successful Create Content: " + existing.Id);
                    }
                }

                var uploadedImages = new List<(string Url, string PublicId, int Order, bool IsMain)>();

                if (request.ContentImages != null && request.ContentImages.Count > 0)
                {
                    // Precompute order/isMain BEFORE parallelizing (order depends on position, not completion time)
                    var plannedUploads = new List<(IFormFile File, int Order, bool IsMain)>();
                    int sequentialOrder = 1;
                    bool first = true;

                    foreach (var file in request.ContentImages)
                    {
                        string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        int order = int.TryParse(fileName, out int parsedOrder) ? parsedOrder : sequentialOrder;
                        if (!int.TryParse(fileName, out _)) sequentialOrder++;

                        plannedUploads.Add((file, order, first));
                        first = false;
                    }

                    using var semaphore = new SemaphoreSlim(MaxConcurrentUploads);
                    using var failureCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                    Exception? firstFailure = null;

                    var tasks = plannedUploads.Select(async item =>
                    {
                        await semaphore.WaitAsync(failureCts.Token);
                        try
                        {
                            if (failureCts.IsCancellationRequested) return;

                            var uploadResult = await UploadWithRetry(item.File, failureCts.Token);
                            uploadedImages.Add((uploadResult.SecureUrl.AbsoluteUri, uploadResult.PublicId, item.Order, item.IsMain));
                        }
                        catch (Exception ex)
                        {
                            firstFailure ??= ex;
                            failureCts.Cancel(); // stop other in-flight/queued uploads early
                        }
                        finally
                        {
                            semaphore.Release();
                        }
                    });

                    await Task.WhenAll(tasks);

                    if (firstFailure != null)
                    {
                        await RollbackUploads(uploadedImages.ToList(), imageService);
                        return Result<string>.Failure(firstFailure.Message ?? "Failed to upload images", 400);
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

                    content.Slug = request.ContentDto.Name.GenerateSlug(context.Contents);
                    content.CreatedAt = DateTime.UtcNow;
                    content.CreatedBy = contextAccessor.HttpContext?.User?.Identity?.Name ?? "system";
                    content.IdempotencyKey = request.IdempotencyKey;

                    context.Contents.Add(content);
                    await context.SaveChangesAsync(cancellationToken);

                    return Result<string>.Success("Successful Create Content: " + content.Id);
                }
                catch (DbUpdateException) when (!string.IsNullOrWhiteSpace(request.IdempotencyKey))
                {
                    // Unique constraint hit = a duplicate/racing request already created this content.
                    // Don't fail the user — return the record that won, and clean up our now-orphaned images.
                    await RollbackUploads(uploadedImages.ToList(), imageService);

                    var winner = await context.Contents
                        .FirstOrDefaultAsync(c => c.IdempotencyKey == request.IdempotencyKey, cancellationToken);

                    return winner != null
                        ? Result<string>.Success("Successful Create Content: " + winner.Id)
                        : Result<string>.Failure("Failed to create content", 400);
                }
                catch (Exception ex)
                {
                    await RollbackUploads(uploadedImages.ToList(), imageService);
                    return Result<string>.Failure(ex.Message ?? "Failed to save content", 500);
                }
            }

            private async Task<CloudinaryDotNet.Actions.UploadResult> UploadWithRetry(IFormFile file, CancellationToken cancellationToken)
            {
                int attempt = 0;
                int currentDelay = InitialRetryDelayMs;

                while (true)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    try
                    {
                        var uploadResult = await imageService.UploadContentImage(file);
                        if (uploadResult != null && uploadResult.Error == null)
                            return uploadResult;

                        throw new Exception(uploadResult?.Error?.Message ?? "Upload failed");
                    }
                    catch (Exception ex) when (IsNetworkException(ex))
                    {
                        attempt++;
                        if (attempt >= MaxRetryAttempts) throw;

                        int jitter = Random.Shared.Next(-2000, 2000);
                        await Task.Delay(Math.Max(1000, currentDelay + jitter), cancellationToken);
                        currentDelay = Math.Min(currentDelay * 2, MaxRetryDelayMs);
                    }
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