using Microsoft.EntityFrameworkCore.Migrations;

namespace IPD.Web.Api.Migrations
{
    public partial class v007AddUserTranslateUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTranslate_Users_UserId",
                table: "UserTranslate");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTranslate_Users_UserId",
                table: "UserTranslate",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTranslate_Users_UserId",
                table: "UserTranslate");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTranslate_Users_UserId",
                table: "UserTranslate",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
