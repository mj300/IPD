using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace IPD.Web.Api.CoreFiles
{
   public class EmailSettings
   {
      [JsonProperty(PropertyName = "MailServer")]
      internal string MailServer { get; set; }
      [JsonProperty(PropertyName = "MailPort")]
      internal int MailPort { get; set; }
      [JsonProperty(PropertyName = "SenderName")]
      internal string SenderName { get; set; }
      [JsonProperty(PropertyName = "Sender")]
      internal string Sender { get; set; }
      [JsonProperty(PropertyName = "Password")]
      internal string Password { get; set; }
      [JsonProperty(PropertyName = "LogoUrl")]
      internal string LogoUrl { get; set; }
      [JsonProperty(PropertyName = "EmailServiceDomain")]
      internal string EmailServiceDomain { get; set; }

      /// <summary>
      /// Value determining whether SSL should be check 
      /// when calling the API endpoint
      /// </summary>
      [JsonProperty(PropertyName = "SslCheck")]
      internal bool SslCheck { get; }
   }
}
