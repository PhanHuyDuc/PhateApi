namespace Application.WebInfos.DTOs
{
    public class WebInfoDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string MetaDescription { get; set; }
        public string? Keywords { get; set; }
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public required string Url { get; set; }
    }
}