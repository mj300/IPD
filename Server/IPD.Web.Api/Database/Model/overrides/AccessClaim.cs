using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;

using IPD.Web.Api.CoreFiles;

namespace IPD.Web.Api.Database.Model.overrides
{
   [Table("AccessClaim")]
   public class AccessClaim<TKey> : IdentityUserClaim<TKey> where TKey : IEquatable<TKey>
   {
      [NotMapped, JsonIgnore]
      public override int Id { get; set; }
      [ForeignKey("Id"), JsonIgnore]
      public override TKey UserId { get; set; }
      public override string ClaimType { get; set; } = AppConst.AccessClaimType;
      public override string ClaimValue { get; set; }
   }
}
