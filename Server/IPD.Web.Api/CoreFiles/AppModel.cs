using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IPD.Web.Api.CoreFiles
{
   public class LoginInfo
   {
      [Required(ErrorMessage = "UserNameRequired")]
      public string UserName { get; set; }
      [Required(ErrorMessage = "PasswordRequired")]
      public string Password { get; set; }
      public bool RememberMe { get; set; }
   }
   public class Error
   {
      /// <summary>
      /// Method to create an error object to be send to client side
      /// </summary>
      /// <summary>
      /// Constructor to create a new instance of error object
      /// </summary>
      /// <param name="key">The key value of the error (ID)</param>
      /// <param name="value">"The Value of the error (Message)"</param>
      public Error(string key, string value)
      {
         Key = key;
         Value = value;
      }
      /// <summary>
      /// Error Key (ID)
      /// </summary>
      public string Key { get; set; } = "0";
      /// <summary>
      /// Error Value (Message)
      /// </summary>
      public string Value { get; set; }
   }
}
