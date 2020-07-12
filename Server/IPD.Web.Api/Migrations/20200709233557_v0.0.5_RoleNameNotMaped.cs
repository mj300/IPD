using Microsoft.EntityFrameworkCore.Migrations;

namespace IPD.Web.Api.Migrations
{
    public partial class v005_RoleNameNotMaped : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Roles");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Roles",
                type: "nvarchar(30)",
                nullable: false,
                defaultValue: "");
        }
    }
}
