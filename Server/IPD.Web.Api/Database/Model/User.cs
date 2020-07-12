using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;

using Newtonsoft.Json;

namespace IPD.Web.Api.Database.Model
{
   [Table("Users")]
   public class User : IdentityUser<int>
   {
      //  public User() => UserName = $"p8b{new Random().Next(0, 99)}";

      #region nvarchar(256), Required, StringLength(256)
      [NotMapped]
      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "FirstNameRequired")]
      [StringLength(256, ErrorMessage = "FirstNameLength")]
      #endregion
      public string FirstName { get; set; }

      #region nvarchar(256), Required, StringLength(256)
      [Column(TypeName = "nvarchar(256)")]
      [NotMapped]
      [Required(ErrorMessage = "SurnameRequired")]
      [StringLength(256, ErrorMessage = "SurnameLength")]
      #endregion
      public string Surname { get; set; }

      [DataType(DataType.Date)]
      public DateTime RegisteredDate { get; set; } = DateTime.Now;

      [Required(ErrorMessage = "RoleRequired")]
      [ForeignKey("RoleId")]
      public Role Role { get; set; }

      [JsonIgnore]
      [InverseProperty("User")]
      public List<UserTranslate> UserTranslates { get; set; } = new List<UserTranslate>();

      [NotMapped]
      public string TempPassword { get; set; }

      [RegularExpression(@"^(\+98|0)?9\d{9}$", ErrorMessage = "InvalidPhoneNumber")]
      public override string PhoneNumber { get; set; }

      #region Required, DateType(EmailAddress), RegularExpression
      [DataType(DataType.EmailAddress, ErrorMessage = "InvalidEmail")]
      [Required(ErrorMessage = "EmailRequired")]
      [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
          ErrorMessage = "InvalidEmail")]
      #endregion
      public override string Email { get; set; }

      [Required(ErrorMessage = "UserNameRequired")]
      public override string UserName { get; set; }

      public bool SubscribeNewsLetter { get; set; }

      #region **** JsonIgnore extra properties and sensitive properties ****
      #region Required, DateType(Password), JsonIgnore
      [DataType(DataType.Password)]
      [Required(ErrorMessage = "Password Required \n")]
      [JsonIgnore]
      #endregion
      public override string PasswordHash { get; set; }
      [JsonIgnore]
      public override DateTimeOffset? LockoutEnd { get; set; }
      [JsonIgnore]
      public override bool TwoFactorEnabled { get; set; }
      [JsonIgnore]
      public override bool PhoneNumberConfirmed { get; set; }
      [JsonIgnore]
      public override string ConcurrencyStamp { get; set; }
      [JsonIgnore]
      public override string SecurityStamp { get; set; }
      [JsonIgnore]
      public override string NormalizedEmail { get; set; }
      [JsonIgnore]
      [NotMapped]
      public override string NormalizedUserName { get; set; }
      [JsonIgnore]
      public override bool LockoutEnabled { get; set; }
      [JsonIgnore]
      public override int AccessFailedCount { get; set; }
      #endregion
   }

   public class UserTranslate
   {
      public int Id { get; set; }
      [ForeignKey("UserId")]
      public User User { get; set; }
      public int LangId { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      public string FirstName { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      public string Surname { get; set; }
   }
}
