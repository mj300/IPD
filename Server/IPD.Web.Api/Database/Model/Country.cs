using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IPD.Web.Api.Database.Model
{
   public class Country
   {
      [Key]
      public int LanguageId { get; set; }

      [Key]
      public int CountryId { get; set; }

      [Column(TypeName = "nvarchar(180)")]
      [Required(ErrorMessage = "Country Name is Required \n")]
      public string CountryName { get; set; }
   }
}
