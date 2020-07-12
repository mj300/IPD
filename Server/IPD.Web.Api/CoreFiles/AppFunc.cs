using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace IPD.Web.Api.CoreFiles
{
   public static class AppFunc
   {
      /// <summary>
      /// This method is used to extract the errors form model state
      /// </summary>
      /// <param name="ModelState">The instance of model state which contains the errors</param>
      /// <param name="errorList">the reference of error list to add the errors to </param>
      public static void ExtractErrors(ModelStateDictionary ModelState, ref List<Error> errorList)
      {
         int count = 0;
         string s = CultureInfo.CurrentCulture.DisplayName;
         // Loop through the Model state values
         foreach (var prop in ModelState.Values)
         {
            /// add each error in the model state to the error list
            Error(ref errorList,
                  prop.Errors.FirstOrDefault().ErrorMessage,
                  ModelState.Keys.ToArray()[count]);
            count++;
         }
      }

      /// <summary>
      /// This method is used to extract the errors form model state
      /// </summary>
      /// <param name="ModelState">The instance of model state which contains the errors</param>
      /// <param name="errorList">the reference of error list to add the errors to </param>
      public static void ExtractErrors(IEnumerable<IdentityError> list, ref List<Error> errorList)
      {
         // Loop through the Model state values
         foreach (var error in list)
         {
            /// add each error in the model state to the error list
            Error(ref errorList,
                  error.Description,
                  error.Code);
         }
      }

      /// <summary>
      /// Used to create a anonymous type and adding it to the referenced error list
      /// </summary>
      /// <param name="Key">Id of the error</param>
      /// <param name="Message">The error message</param>
      /// <param name="errors">Reference of the error list used to add the error</param>
      public static void Error(ref List<Error> errors, string value, string key = "")
      {
         if (string.IsNullOrWhiteSpace(key))
            key = new Random().Next(1, 20).ToString();
         errors.Add(new Error(key, value));
      }

      /// <summary>
      ///     Used to extract the difference between the parameter dateTime and UtcNow.
      /// </summary>
      /// <param name="timeDate">DateTime object to compare with the current Utc time</param>
      /// <returns>Returns a string type which states the time difference. (dd hh mm ss)</returns>
      public static string CompareWithCurrentTime(DateTimeOffset? timeDate)
      {
         if (timeDate == null)
            return "";
         /// checks the difference between the parameter dateTime and
         /// the current Utc time which would return the following format 
         /// 00.00:00:00.0000 (days.hours:minutes:seconds.milliseconds)
         var comparedTime = (timeDate - DateTimeOffset.UtcNow);

         /// convert the difference to string and split it at "."
         var initSplit = comparedTime.ToString().Split(".");

         /// switch the split length and split then at correct
         switch (initSplit.Length)
         {
            case 3: // Contains both days and time
               /// since number of days is available then the time would be located at the position "1"
               /// within the initSplit with position 0 = hours, 1 = minutes, 2 = seconds
               var timeSplit3 = initSplit[1].Split(":");
               return string.Format("Day(s): {0}, Hour(s): {1}, Minute(s): {2}, Second(s): {3}",
                   initSplit[0], timeSplit3[0], timeSplit3[1], timeSplit3[2]);

            case 2:// contains only time and milliseconds
               /// since number of days is not available then the time would be located at the position "0"
               /// within the initSplit with position 0 = hours, 1 = minutes, 2 = seconds
               var timeSplit1 = initSplit[0].Split(":");
               if (timeSplit1[0] != "00")// if hours is not 0
                  return string.Format("{0} hours, {1} minutes and {2} seconds",
                      timeSplit1[0], timeSplit1[1], timeSplit1[2]);
               if (timeSplit1[1] != "00") // if minutes is not 0
                  return string.Format("{0} minutes and {1} seconds.",
                      timeSplit1[1], timeSplit1[2]);
               // if only the seconds is left
               return string.Format("{0} seconds.",
                   timeSplit1[2]);
            default:// show the entire time difference 
               return timeDate.ToString();
         }
      }

      public static int GetLanguageId(string language = null)
      {

         if (language == null)
            language = CultureInfo.CurrentCulture.Name;
         switch (language)
         {
            case "en-US":
            case "en-UK":
               return 1;
            case "fa-IR":
               return 2;
            case "ar":
               return 3;
            default:
               return 0;
         }
      }

   }
}
