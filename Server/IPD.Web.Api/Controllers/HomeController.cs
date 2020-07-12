using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Localization;
using Microsoft.Extensions.Localization;

using IPD.Web.Api.CoreFiles;

namespace IPD.Web.Api.Controllers
{
   [ServiceFilter(typeof(LanguageActionFilter))]
   [Route("{culture}/[controller]")]
   public class HomeController : Controller
   {
      private readonly IStringLocalizer<HomeController> _localizer;

      public HomeController(IStringLocalizer<HomeController> localizer)
      {
         _localizer = localizer;
      }

      [HttpGet("[action]")]
      public IActionResult Get()
      {
         return Ok(_localizer["hello"].Value);
      }
   }
}
