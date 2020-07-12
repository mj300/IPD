﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using IPD.Web.Api.CoreFiles;

namespace IPD.Web.Api.Database.Model
{
   [Table("Tokens")]
   public class Token
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(MAX)")]
      [Required(ErrorMessage = "Value is Required \n")]
      public string Value { get; set; }

      [Required(ErrorMessage = "Token Type is Required \n")]
      public TokenType ValueType { get; set; }

      [Column(TypeName = "nvarchar(30)")]
      [DataType(DataType.Date)]
      [Required(ErrorMessage = "Expiry Date is Required")]
      public DateTime ExpiaryDateTime { get; set; }

      [ForeignKey("UserId")]
      public User User { get; set; }

      [ForeignKey("Email")]
      public string Email { get; set; }

      /// <summary>
      /// Returns a random token in "X-0-00-000"
      /// </summary>
      public string GetToken()
      {
         string prefix = "X";
         switch (ValueType)
         {
            case TokenType.ConfirmEmail:
               prefix = "CM";
               break;
            case TokenType.ResetPassword:
               prefix = "RP";
               break;
            case TokenType.Subscription:
               prefix = "S";
               break;
            default:
               prefix = "DX";
               break;
         }

         Random rn = new Random();
         return $"{prefix}-{rn.Next(100, 999)}-{rn.Next(1000, 9999)}";
      }
   }
}
