using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;


using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using IPD.Web.Api.Database.Model;
using IPD.Web.Api.Database.Model.overrides;

namespace IPD.Web.Api.Database
{
   public class AppDbContext : IdentityUserContext<User, int,
       AccessClaim<int>,
       IdentityUserLogin<int>,
       IdentityUserToken<int>>
   {
      public DbSet<Role> Roles { get; set; }
      public DbSet<RoleTranslate> RolesTranslate { get; set; }
      public DbSet<UserTranslate> UserTranslate { get; set; }
      public DbSet<Token> Tokens { get; set; }

      protected override void OnModelCreating(ModelBuilder builder)
      {
         base.OnModelCreating(builder);


         builder.Entity<AccessClaim<int>>().HasKey(i => i.UserId);
         builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
         builder.Entity<IdentityUserToken<int>>().ToTable("UserLoginTokens");
         builder.Entity<User>().ToTable("Users");
         builder.Entity<AccessClaim<int>>().ToTable("AccessClaims");
         builder.Entity<User>().HasMany(r => r.UserTranslates).WithOne(t => t.User).OnDelete(DeleteBehavior.Cascade);

         builder.Entity<User>().HasIndex(u => u.UserName).IsUnique();
         builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
         builder.Entity<AccessClaim<int>>().Ignore(i => i.Id);

         builder.Entity<Token>().HasOne(t => t.User).WithMany().OnDelete(DeleteBehavior.Cascade);

         builder.Entity<Role>().HasMany(r => r.RoleTranslates).WithOne(t => t.Role).OnDelete(DeleteBehavior.Cascade);

         //   builder.Entity<RoleTranslate>(t => t.HasNoKey());

      }

      public AppDbContext(DbContextOptions<AppDbContext> options)
          : base(options)
      {
      }


   }
}
