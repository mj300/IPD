using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc.Filters;

namespace IPD.Web.Api.CoreFiles
{
   public class LanguageActionFilter : ActionFilterAttribute
   {

      public override void OnActionExecuting(ActionExecutingContext context)
      {
         string culture = context.RouteData.Values["culture"].ToString();

#if NET451
            System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo(culture);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(culture);
#elif NET46
            System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo(culture);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(culture);
#else
         CultureInfo.CurrentCulture = new CultureInfo(culture);
         CultureInfo.CurrentUICulture = new CultureInfo(culture);
         CultureInfo.DefaultThreadCurrentCulture = new CultureInfo(culture);
         CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo(culture);
#endif
         base.OnActionExecuting(context);
      }
   }
}
