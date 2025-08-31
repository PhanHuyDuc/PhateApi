using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContentProp2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentImages_Products_ProductId",
                table: "ContentImages");

            migrationBuilder.DropIndex(
                name: "IX_ContentImages_ProductId",
                table: "ContentImages");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "ContentImages");

            migrationBuilder.RenameColumn(
                name: "ArtistContent",
                table: "Contents",
                newName: "Artist");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Artist",
                table: "Contents",
                newName: "ArtistContent");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "ContentImages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ContentImages_ProductId",
                table: "ContentImages",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContentImages_Products_ProductId",
                table: "ContentImages",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
