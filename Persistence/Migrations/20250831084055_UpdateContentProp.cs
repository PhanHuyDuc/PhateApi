using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContentProp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contents_Artists_ArtistId",
                table: "Contents");

            migrationBuilder.DropIndex(
                name: "IX_Contents_ArtistId",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "ArtistId",
                table: "Contents");

            migrationBuilder.AddColumn<string>(
                name: "ArtistContent",
                table: "Contents",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArtistContent",
                table: "Contents");

            migrationBuilder.AddColumn<Guid>(
                name: "ArtistId",
                table: "Contents",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Contents_ArtistId",
                table: "Contents",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contents_Artists_ArtistId",
                table: "Contents",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
