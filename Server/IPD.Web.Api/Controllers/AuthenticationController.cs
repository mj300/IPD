using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using IPD.Web.Api.CoreFiles;
using IPD.Web.Api.Database;
using IPD.Web.Api.Database.Model;

namespace IPD.Web.Api.Controllers
{
   [ServiceFilter(typeof(LanguageActionFilter))]
   [Route("{culture}/[controller]")]
   public class AuthenticationController : Controller
   {
      private readonly AppDbContext AppDbContext;
      private readonly UserManager<User> _UserManager;
      private readonly SignInManager<User> _SignInManager;
      private List<Error> ErrorsList = new List<Error>();

      public AuthenticationController(AppDbContext db,
          UserManager<User> um, SignInManager<User> sm)
      {
         AppDbContext = db;
         _UserManager = um;
         _SignInManager = sm;
      }


      /// <summary>
      ///     Login the user into the system
      /// </summary>
      #region ** Attributes: HttpPost, 422 UnprocessableEntity, Return Status 200/ 401/ 400 **
      [HttpPost("[action]")] // Login Method
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status401Unauthorized)]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      #endregion
      public async Task<IActionResult> LoginAsync([FromBody] LoginInfo loginInfo)
      {
         try
         {
            ///// If email parameter is empty
            ///// return "unauthorized" response (stop code execution)
            //if (string.IsNullOrWhiteSpace(loginInfo.UserName))
            //   /// in the case any exceptions return the following error
            //   AppFunc.Error(ref ErrorsList, "UserName is required!", "UserName");
            //if (string.IsNullOrWhiteSpace(loginInfo.Password))
            //   AppFunc.Error(ref ErrorsList, "Password is required!", "Password");
            //if (ErrorsList.Count > 0)
            //   return BadRequest(ErrorsList);

            /// if model validation failed
            if (!TryValidateModel(loginInfo))
            {
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            /// Find the user with the provided email address
            User user = await _UserManager
                    .FindByNameAsync(loginInfo.UserName).ConfigureAwait(false);

            /// if no user is found on the database
            // return "unauthorized" response (stop code execution)
            if (user == null)
            {
               /// in the case any exceptions return the following error
               AppFunc.Error(ref ErrorsList, "UserName not registered", "UserName");
               return BadRequest(ErrorsList);
            }

            /// Check if user's account is locked
            if (user.LockoutEnabled)
            {
               /// get the current lockout end dateTime
               var currentLockoutDate =
                   await _UserManager.GetLockoutEndDateAsync(user).ConfigureAwait(false);

               /// if the user's lockout is not expired (stop code execution)
               if (user.LockoutEnd > DateTimeOffset.UtcNow)
               {
                  /// in the case any exceptions return the following error
                  AppFunc.Error(ref ErrorsList, string.Format("Account Locked for {0}"
                      , AppFunc.CompareWithCurrentTime(user.LockoutEnd)));
                  return BadRequest(ErrorsList);
               }
               /// else lockout time has expired
               // disable user lockout
               await _UserManager.SetLockoutEnabledAsync(user, false).ConfigureAwait(false);
               await _UserManager.ResetAccessFailedCountAsync(user).ConfigureAwait(false);
            }

            /// else user account is not locked
            // Attempt to sign in the user
            var SignInResult = await _SignInManager
                .PasswordSignInAsync(user,
                loginInfo.Password,
                loginInfo.RememberMe,
                false).ConfigureAwait(false);

            /// If password sign-in succeeds
            // responded ok 200 status code with
            //the user's role attached (stop code execution)
            if (!SignInResult.Succeeded)
            {
               /// else login attempt failed
               /// increase and update the user's failed login attempt by 1
               await _UserManager.AccessFailedAsync(user).ConfigureAwait(false);

               /// if failed login attempt is less than/ equal to 5 (stop code execution)
               if (user.AccessFailedCount <= 5)
               {
                  /// in the case any exceptions return the following error
                  AppFunc.Error(ref ErrorsList, "Incorrect Password!", "password");
                  return Unauthorized(ErrorsList);
               }

               /// else user has tried their password more than 15 times
               // lock the user and ask them to reset their password
               user.LockoutEnabled = true;
               user.LockoutEnd = DateTimeOffset.UtcNow.AddMinutes(user.AccessFailedCount);

               /// in the case any exceptions return the following error
               AppFunc.Error(ref ErrorsList, string.Format("Account Locked for {0}"
                       , AppFunc.CompareWithCurrentTime(user.LockoutEnd)));
               return Unauthorized(ErrorsList);
            }
            user.Role = (await AppDbContext.Users.Include(u => u.Role)
              .FirstOrDefaultAsync(u => u.Id == user.Id)
              .ConfigureAwait(false))
              ?.Role;
            return Ok(user);
         }
         catch (Exception)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Logout the current user
      /// </summary>
      #region ** Attributes: HttpGet, Return Status 200/ 400 **
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]
      [HttpGet("[action]")]
      public async Task<IActionResult> Logout()
      {
         try
         {
            /// try to sign-out the user and return ok
            await _SignInManager.SignOutAsync().ConfigureAwait(false);
            return Ok(new { isAuthenticated = false });
         }
         catch (Exception)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Check if the user is still logged-in. 
      /// </summary>
      #region ** Attributes: HttpGet, Return Status 200/ 401/ 417 **
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status401Unauthorized)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]
      [HttpGet("[action]")]
      public async Task<IActionResult> Silent()
      {
         try
         {
            int.TryParse(User.Claims
                .FirstOrDefault(c => c.Type == "UserId")?.Value, out int userId);

            User user = await AppDbContext.Users.AsNoTracking()
              .Include(u => u.Role)
              .FirstOrDefaultAsync(u => u.Id == userId)
              .ConfigureAwait(false);

            if (user == null)
               return Unauthorized();
            else
               return Ok(user);
         }
         catch (Exception)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
