using System;
using System.ComponentModel.DataAnnotations;

namespace IPD.Web.Api.CoreFiles.Attributes
{
   [AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
   /// <summary>
   /// Custom validation attribute to check the Access claim property for Roles
   /// </summary>
   public class ValidateAccessClaimAttribute : ValidationAttribute
   {
      //Never Used Only for handle output from Enum.TryParse
      private object result;

      /// <summary>
      /// this method will be executed when the TryValidateModel(model instance) is called
      /// this method will check if the value of the property is a valid access claim value
      /// <bold>Returns True if valid else returns false</bold>
      /// </summary>
      /// <param name="value">The value object to be checked</param>
      public override bool IsValid(object value) =>
          Enum.TryParse(typeof(AccessClaims), (string)value, true, out result);
   }
}
