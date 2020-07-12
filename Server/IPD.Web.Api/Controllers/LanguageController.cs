using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using IPD.Web.Api.CoreFiles;

namespace IPD.Web.Api.Controllers
{
   [ServiceFilter(typeof(LanguageActionFilter))]
   [Route("{culture}/[controller]")]
   public class LanguageController : Controller
   {
      [HttpGet("[action]")]
      public IActionResult Get()
      {
         return Ok();
      }

   }
}
