using Microsoft.EntityFrameworkCore.Migrations;

namespace IPD.Web.Api.Migrations
{
    public partial class v004 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "RolesTranslate");

            migrationBuilder.AddColumn<int>(
                name: "LangId",
                table: "RolesTranslate",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LangId",
                table: "RolesTranslate");

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "RolesTranslate",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
