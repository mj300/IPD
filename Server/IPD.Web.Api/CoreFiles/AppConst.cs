using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

using IPD.Web.Api.CoreFiles;

using Newtonsoft.Json;

namespace IPD.Web.Api.CoreFiles
{

   /// <summary>
   /// Four Levels of access claims within the system.<br />
   /// * Admin<br/>
   /// * Manager<br/>
   /// * Staff<br/>
   /// * Patient
   /// </summary>
   public enum AccessClaims
   {
      Admin = 0,
      Manager = 1,
      Staff = 2,
      Patient = 3
   }

   public enum TokenType
   {
      ResetPassword = 0,
      ConfirmEmail = 1,
      Subscription = 2
   }

   public class AppConst
   {
      /// <summary>
      /// Get all records from search API
      /// </summary>
      public const string GetAllRecords = "***GET-ALL***";
      public const string AccessClaimType = "Role";
      public struct CommonErrors
      {
         /// <summary>
         /// * Level One includes Admin
         /// </summary>
         public const string ServerError = "Server Error. Please Contact Administrator.";

      }

      /// <summary>
      /// Four Levels of access policies within the system.<br />
      /// </summary>
      public struct AccessPolicies
      {
         /// <summary>
         /// TopSecret Policy includes the following Roles <br/>
         /// * Admin <br/>
         /// </summary>
         public const string TopSecret = nameof(TopSecret);

         /// <summary>
         /// Secret Policy includes the following Roles <br/>
         /// * Admin <br/>
         /// * Manager <br/>
         /// </summary>
         public const string Secret = nameof(Secret);

         /// <summary>
         /// Restricted Policy includes the following Roles <br/>
         /// * Admin <br/>
         /// * Manager <br/>
         /// * Staff <br/>
         /// </summary>
         public const string Restricted = nameof(Restricted);

         /// <summary>
         /// Official Policy includes the following Roles <br/>
         /// * Admin <br/>
         /// * Manager <br/>
         /// * Staff <br/>
         /// * Customer <br/>
         /// </summary>
         public const string Official = nameof(Official);
      }


      /// <summary>
      /// Get the information from the appSettings json file
      /// </summary>
      public static Settings Settings
      {
         get
         {
            /// Get the directory of the app settings.json file
            var jsonFilePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\CoreFiles\Settings.json";
            /// If above file does not exists check the android path.
            if (!File.Exists(jsonFilePath))
               jsonFilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"CoreFiles\Settings.json");
            /// Read the json file from that directory
            /// de-serialise the json string into an object of AppSettings and return it
            return JsonConvert.DeserializeObject<Settings>(File.ReadAllText(jsonFilePath));
         }
      }

      public static List<string> SupportLanguages
      {
         get
         {
            List<string> languages = new List<string>();
            languages.Add("en-US");
            languages.Add("fa-IR");
            languages.Add("ar");
            return languages;
         }
      }
   }

}
