using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;

namespace IPD.Web.Api.CoreFiles
{
   public class UserProfileRequestCultureProvider : RequestCultureProvider
   {
      public override Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
      {
         if (httpContext == null)
         {
            throw new ArgumentNullException(nameof(httpContext));
         }

         var culture = CultureInfo.CurrentCulture;
         if (culture == null)
         {
            return Task.FromResult((ProviderCultureResult)null);
         }

         return Task.FromResult(new ProviderCultureResult(culture.Name));
      }
   }
}
