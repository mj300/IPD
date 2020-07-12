using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using IPD.Web.Api.CoreFiles;
using IPD.Web.Api.CoreFiles.Attributes;

using Newtonsoft.Json;

namespace IPD.Web.Api.Database.Model
{

   public class Role
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(30)")]
      //[Required(ErrorMessage = "Role Name is Required \n")]
      [Display(Name = "RoleName")]
      [Required(ErrorMessage = "RoleNameRequired")]
      [NotMapped]
      public string Name { get; set; }

      [Column(TypeName = "nvarchar(30)")]
      [Required(ErrorMessage = "AccessClaimRequired")]
      [ValidateAccessClaim(ErrorMessage = "AccessClaimNotValid")]
      public string AccessClaim { get; set; }

      [JsonIgnore]
      [InverseProperty("Role")]
      public ICollection<User> Users { get; set; }

      [JsonIgnore]
      [InverseProperty("Role")]
      public List<RoleTranslate> RoleTranslates { get; set; } = new List<RoleTranslate>();
   }


   public class RoleTranslate
   {
      public int Id { get; set; }
      [ForeignKey("RoleId")]
      public Role Role { get; set; }
      public int LangId { get; set; }
      public string Name { get; set; }
   }
}
