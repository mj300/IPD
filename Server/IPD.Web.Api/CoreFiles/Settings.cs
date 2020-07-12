using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace IPD.Web.Api.CoreFiles
{
   /// <summary>
   /// class used to have the app setting information in memory
   /// </summary>
   public class Settings
   {
      /// <summary>
      /// The array of allowed CORs (Cross-Origin Request) URL
      /// which are allowed to connect to the web API
      /// </summary>
      [JsonProperty(PropertyName = "OpenCors")]
      public string[] OpenCors { get; set; }
      /// <summary>
      /// Exclude specific routes from CORs check.
      /// Must provide the URI <br/>
      /// e.g. "/Images/test.png" specific file or "/Images" Folder or "/user/post" Route
      /// </summary>
      [JsonProperty(PropertyName = "ExcludeRouteFromCors")]
      public string[] ExcludeRouteFromCors { get; set; }

      /// <summary>
      /// Email settings used in MmJ Email Services
      /// </summary>
      [JsonProperty(PropertyName = "EmailSettings")]
      public EmailSettings EmailSettings { get; set; }

      /// <summary>
      /// The array of allowed CORs (Cross-Origin Request) URL
      /// which are allowed to connect to the web API
      /// </summary>
      [JsonProperty(PropertyName = "DbConnectionStrings")]
      public string[] _DbConnectionStrings { get; set; }

      public string DbConnectionString()
      {
         static bool checkConnection(string connectionString)
         {
            try
            {
               using (var con = new SqlConnection(connectionString))
               {
                  con.Open();
               }
               return true;
            }
            catch (Exception)
            {
               return false;
            }
         }

         string SelectedConnection = "";
         foreach (string connection in _DbConnectionStrings)
         {
            if (checkConnection(connection))
            {
               SelectedConnection = connection;
               break;
            }
         }
         return SelectedConnection;
      }
   }
}
