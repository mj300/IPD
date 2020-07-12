using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;

using IPD.Web.Api.CoreFiles;
using IPD.Web.Api.CoreFiles.Extensions;
using IPD.Web.Api.Database;
using IPD.Web.Api.Database.Model;

using SQLitePCL;

namespace IPD.Web.Api.Controllers
{
   [ServiceFilter(typeof(LanguageActionFilter))]
   [Route("{culture}/[controller]")]
   // [Authorize(oAppConst.AccessPolicies.LevelFour)]
   public class UserController : Controller
   {
      private readonly IStringLocalizer<RoleController> _localizer;
      private AppDbContext AppDbContext { get; }
      private UserManager<User> _UserManager { get; }
      private SignInManager<User> _SignInManager { get; }
      private EmailSettings _EmailSettings { get; }
      //private oEmailService EmailService
      //{
      //   get => new oEmailService(_EmailSettings, HttpContext, AppDbContext);
      //}
      private List<Error> ErrorsList = new List<Error>();

      private bool isUserCreated { get; set; } = false;

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      /// <param name="um)">Receive the UserManager instance from the ASP.Net Pipeline</param>
      public UserController(AppDbContext db,
          UserManager<User> um,
          EmailSettings es,
          SignInManager<User> sm,
          IStringLocalizer<RoleController> localizer)
      {
         AppDbContext = db;
         _UserManager = um;
         _EmailSettings = es;
         _SignInManager = sm;
         _localizer = localizer;
      }

      /// <summary>
      /// Used to get a list of all users
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{selectedPage}/{maxItemsPerPage}/{searchValue}/{filterRole}/" +
          "{isSortAsce}/{sortName}")]
      //[Authorize(AppConst.AccessPolicies.Secret)] /// First Level Test Pass
      public async Task<IActionResult> Get(
          int selectedPage = 1,
          int maxItemsPerPage = 5,
          string searchValue = AppConst.GetAllRecords,
          string filterRole = AppConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Name"
          )
      {
         try
         {
            //1.Check the search parameter and filters and return the appropriate user list
            //      a.If search value is empty or null then return the filtered users
            //          Note(Default value for parameters)
            //                    searchValue = null
            //ALL OTHER PARAMETERS = ***GET - ALL ***
            int.TryParse(filterRole, out int filterRoleId);
            int langId = AppFunc.GetLanguageId();

            int totalCount = await AppDbContext.Users.Include(r => r.UserTranslates).Include(u => u.Role).Select(u => new User
            {
               Id = u.Id,
               FirstName = u.UserTranslates.FirstOrDefault(e => e.LangId == langId).FirstName,
               Surname = u.UserTranslates.FirstOrDefault(e => e.LangId == langId).Surname,
               Email = u.Email,
               UserName = u.UserName,
               PhoneNumber = u.PhoneNumber,
               Role = u.Role

            })
                .Where(u => filterRole.Equals(AppConst.GetAllRecords) ? true : u.Role.Id == filterRoleId)
                .CountAsync(u => searchValue.Equals(AppConst.GetAllRecords) ? true :
                                  u.FirstName.Contains(searchValue)
                               || u.Surname.Contains(searchValue)
                               || u.Email.Contains(searchValue)
                               || u.UserName.Contains(searchValue)
                               || u.PhoneNumber.Contains(searchValue)
                ).ConfigureAwait(false);
            List<User> list = await AppDbContext.Users.Include(r => r.UserTranslates).Include(u => u.Role).
               ThenInclude(r => r.RoleTranslates).Select(u => new User
               {
                  Id = u.Id,
                  FirstName = u.UserTranslates.FirstOrDefault(e => e.LangId == langId).FirstName,
                  Surname = u.UserTranslates.FirstOrDefault(e => e.LangId == langId).Surname,
                  Email = u.Email,
                  UserName = u.UserName,
                  PhoneNumber = u.PhoneNumber,
                  Role = new Role()
                  {
                     Id = u.Role.Id,
                     AccessClaim = u.Role.AccessClaim,
                     Name = u.Role.RoleTranslates.FirstOrDefault(e => e.LangId == langId).Name

                  }
               })
                .Where(u => filterRole.Equals(AppConst.GetAllRecords) ? true : u.Role.Id == filterRoleId)
                .Where(u => searchValue.Equals(AppConst.GetAllRecords) ? true :
                                  u.FirstName.Contains(searchValue)
                               || u.Surname.Contains(searchValue)
                               || u.Email.Contains(searchValue)
                               || u.UserName.Contains(searchValue)
                               || u.PhoneNumber.Contains(searchValue)
                )
                .OrderByDynamic(sortName, isSortAsce)
                .Skip((selectedPage - 1) * maxItemsPerPage)
                .Take(maxItemsPerPage)
                .ToListAsync()
                .ConfigureAwait(false);
            /// return the list of Role ordered by name
            return Ok(new { list, totalCount });
         }
         catch (Exception) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }


      /// <summary>
      ///     Create a new User
      /// </summary>
      #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("Post/Employee")]
      //[Authorize(AppConst.AccessPolicies.Secret)]  /// First Level Test Pass
      public async Task<IActionResult> PostUser([FromBody] User newUser)
      {
         try
         {
            //if (string.IsNullOrWhiteSpace(newUser.TempPassword))
            //   newUser.TempPassword = AppFunc.PasswordGenerator();


            /// find the selected role object of the user
            newUser.Role = await AppDbContext.Roles.AsTracking()
                .SingleOrDefaultAsync(r => r.Id == newUser.Role.Id).ConfigureAwait(false);

            IActionResult result = await CreateUser(newUser).ConfigureAwait(false);

            //if (isUserCreated)
            //{
            //   await EmailService
            //      .NewEmployeePasswordAsync(newUser, DateTime.UtcNow.AddYears(2))
            //      .ConfigureAwait(false);
            //}
            newUser.TempPassword = string.Empty;

            return result;
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Create a new Customer
      /// </summary>
      #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("Post/Patient")]
      public async Task<IActionResult> PostPatient([FromBody] User newCustomer)
      {
         try
         {
            newCustomer.Role = await AppDbContext.Roles
                .SingleOrDefaultAsync(r => r.AccessClaim == AccessClaims.Patient.ToString())
                .ConfigureAwait(false);

            IActionResult result = await CreateUser(newCustomer).ConfigureAwait(false);

            if (!isUserCreated)
            {
               return StatusCode(412, ErrorsList);
            }
            newCustomer.TempPassword = string.Empty;

            //await EmailService
            // .EmailConfirmationAsync(newCustomer, DateTime.UtcNow.AddYears(2))
            // .ConfigureAwait(false);
            await _SignInManager.SignInAsync(newCustomer, false).ConfigureAwait(false);
            return Created("", newCustomer);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Update user record
      /// </summary>
      #region *** Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("[action]")]
      //[Authorize(AppConst.AccessPolicies.Secret)]  /// First Level Test Pass
      public async Task<IActionResult> Put([FromBody] User modifiedUser)
      {
         try
         {
            int langId = AppFunc.GetLanguageId();
            /// Try to validate the model
            TryValidateModel(modifiedUser);
            /// remove the passwordHash and confrimPassword since
            /// the password update gets handled by another method in this class
            ModelState.Remove("PasswordHash");
            if (!ModelState.IsValid)
            {
               /// extract the errors and return bad request containing the errors
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }
            /// if the user record with the same id is not found
            if (!AppDbContext.Users.Any(u => u.Id == modifiedUser.Id))
            {
               AppFunc.Error(ref ErrorsList, _localizer["User not found."].Value);
               return StatusCode(412, ErrorsList);
            }
            /// find the current user details from the database
            User userDetails = AppDbContext.Users.Find(modifiedUser.Id);
            userDetails.UserTranslates = await AppDbContext.UserTranslate.AsTracking().Where(ut => ut.User.Id == userDetails.Id)
                                          .ToListAsync().ConfigureAwait(false);
            UserTranslate userTranslate = userDetails.UserTranslates.SingleOrDefault(ut => ut.LangId == langId);

            /// update the user details with the new details
            userTranslate.FirstName = modifiedUser.FirstName;
            userTranslate.Surname = modifiedUser.Surname;
            userDetails.Email = modifiedUser.Email;
            userDetails.PhoneNumber = modifiedUser.PhoneNumber;
            userDetails.Role = modifiedUser.Role;
            /// thus update user in the context
            AppDbContext.Users.Update(userDetails);
            /// save the changes to the database
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);
            /// thus return 200 ok status with the updated object
            return Ok(userDetails);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
      /// <summary>
      /// Update user record
      /// </summary>
      #region *** Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("[action]")]
      //[Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> PutPatient([FromBody] User modifiedUser)
      {
         try
         {
            int langId = AppFunc.GetLanguageId();
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out int userId);
            User user = AppDbContext.Users.Find(userId);
            user.UserTranslates = await AppDbContext.UserTranslate.AsTracking().Where(ut => ut.User.Id == user.Id)
                                        .ToListAsync().ConfigureAwait(false);
            UserTranslate userTranslate = user.UserTranslates.SingleOrDefault(ut => ut.LangId == langId);

            /// update the user details with the new details
            userTranslate.FirstName = modifiedUser.FirstName;
            userTranslate.Surname = modifiedUser.Surname;
            user.PhoneNumber = modifiedUser.PhoneNumber;
            user.Email = modifiedUser.Email;
            /// Try to validate the model
            TryValidateModel(modifiedUser);
            /// remove the passwordHash and confrimPassword since
            /// the password update gets handled by another method in this class
            ModelState.Remove("PasswordHash");
            if (!ModelState.IsValid)
            {
               /// extract the errors and return bad request containing the errors
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }
            /// thus update user in the context
            AppDbContext.Users.Update(user);
            /// save the changes to the database
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);
            /// thus return 200 ok status with the updated object
            return Ok(user);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Check if the user exists then block the user
      /// </summary>
      #region ***  Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      //[Authorize(AppConst.AccessPolicies.Secret)]
      [HttpPut("put/{userId}/{lockoutEnabled}")]  /// Ready For Test
      public async Task<IActionResult> Put(int userId, bool lockoutEnabled)
      {
         try
         {
            /// if the user with the same id is not found
            User user = await AppDbContext.Users.FindAsync(userId).ConfigureAwait(false);
            if (user == null)
            {
               AppFunc.Error(ref ErrorsList, _localizer["User not found."].Value);
               return StatusCode(412, ErrorsList);
            }
            user.LockoutEnabled = lockoutEnabled;
            /// update user in the context
            AppDbContext.Users.Update(user);
            /// save the changes to the database
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);
            /// thus return 200 ok status with the updated object
            return Ok(user);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Update the password of current user
      /// </summary>
      #region ***  Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      //[Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      [HttpPut("PutMyPassword/{currentPassword}/{password}")]  /// Ready For Test
      public async Task<IActionResult> PutMyPassword(string currentPassword, string password)
      {
         try
         {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out int userId);
            User user = AppDbContext.Users.Find(userId);

            IdentityResult result = await _UserManager.ChangePasswordAsync(user, currentPassword, password);
            if (!result.Succeeded)
            {
               AppFunc.ExtractErrors(result.Errors, ref ErrorsList);
               return StatusCode(412, ErrorsList);
            }
            return Ok(result);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Update the password of current user
      /// </summary>
      #region ***  Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      //[Authorize(oAppConst.AccessPolicies.LevelFour)]  /// Ready For Test
      [HttpPut("Put/TokenPasswordRest")]
      public async Task<IActionResult> PutPasswordToken([FromBody] dynamic tokenPassword)
      {
         try
         {
            string passwordString = tokenPassword.password;
            string tokenString = tokenPassword.token;

            Token token = await AppDbContext.Tokens
               .Include(t => t.User)
               .ThenInclude(u => u.Role)
               .SingleOrDefaultAsync(t => t.Value.Equals(tokenString))
               .ConfigureAwait(false);


            if (token == null)
            {
               /// Add the error below to the error list and return bad request
               AppFunc.Error(ref ErrorsList, _localizer["Token Not Found."].Value);
               return StatusCode(417, ErrorsList);
            }

            if (token.ExpiaryDateTime < DateTime.UtcNow)
            {
               /// Add the error below to the error list and return bad request
               AppFunc.Error(ref ErrorsList, _localizer["Token Expired."].Value);
               return StatusCode(417, ErrorsList);
            }

            token.User.PasswordHash = passwordString;

            User result = await UpdatePassword(token.User).ConfigureAwait(false);

            if (result == null)
               return StatusCode(412, ErrorsList);

            result.Role = token.User.Role;
            token.User = null;
            AppDbContext.Entry(token).State = EntityState.Deleted;
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            await _SignInManager.SignInAsync(result, false).ConfigureAwait(false);

            return Ok(result);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Delete a user
      /// </summary>
      #region *** Delete, 200 OK, 412 PreconditionFailed, 417 ExpectationFailed ***
      [HttpDelete("[action]")]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      //[Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Delete([FromBody] User thisUser)
      {
         try
         {
            /// if the User record with the same id is not found
            if (!AppDbContext.Users.Any(u => u.Id == thisUser.Id))
            {
               AppFunc.Error(ref ErrorsList, _localizer["User not found."].Value);
               return StatusCode(412, ErrorsList);
            }
            /// else the User is found
            /// now delete the user record
            AppDbContext.Users.Remove(AppDbContext.Users.Find(thisUser.Id));
            /// save the changes to the database
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK status
            return Ok(String.Format(_localizer["User ({0}) was deleted"].Value, thisUser.UserName));
         }
         catch (Exception)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }



      private async Task<User> UpdatePassword(User SelectedUser)
      {
         /// find the current user details from the database
         User userDetails = AppDbContext.Users.Find(SelectedUser.Id);
         if (userDetails == null)
         {
            AppFunc.Error(ref ErrorsList, _localizer["User not found."].Value);
            return null;
         }
         /// generate new password reset token
         string passResetToken = await _UserManager.GeneratePasswordResetTokenAsync(userDetails).ConfigureAwait(false);
         /// reset user's password
         IdentityResult result = await _UserManager.ResetPasswordAsync(
                     userDetails, passResetToken, SelectedUser.PasswordHash).ConfigureAwait(false);
         /// if result is Failed
         if (!result.Succeeded)
         {
            foreach (var item in result.Errors)
               ErrorsList.Add(new Error(item.Code, item.Description));
            return null;
         }
         /// else the result is a success.
         return userDetails;
      }
      /// <summary>
      ///     Create a new User
      /// </summary>
      private async Task<IActionResult> CreateUser(User newUser)
      {
         try
         {
            newUser.PasswordHash = newUser.TempPassword;
            newUser.TempPassword = string.Empty;
            ModelState.Clear();
            TryValidateModel(newUser);
            ModelState.Remove("Role.Name");
            /// if model validation failed
            if (!ModelState.IsValid)
            {
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return bad request with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            /// check the database to see if a user with the same email exists
            if (AppDbContext.Users.AsNoTracking().Any(d => d.UserName == newUser.UserName))
            {
               /// extract the errors and return bad request containing the errors
               AppFunc.Error(ref ErrorsList, _localizer["UserName already exists."].Value, "UserName");
               return StatusCode(412, ErrorsList);
            }
            /// Create the new user
            IdentityResult newUserResult = await _UserManager.CreateAsync(newUser, newUser.PasswordHash)
                                                            .ConfigureAwait(false);
            /// If result failed
            if (!newUserResult.Succeeded)
            {
               /// Add the error below to the error list and return bad request
               foreach (var error in newUserResult.Errors)
               {
                  AppFunc.Error(ref ErrorsList, error.Description, error.Code);
               }
               return StatusCode(417, ErrorsList);
            }
            /// else result is successful the try to add the access claim for the user
            IdentityResult addedClaimResult = await _UserManager.AddClaimAsync(
                    newUser,
                    new Claim(AppConst.AccessClaimType, newUser.Role.AccessClaim)
                ).ConfigureAwait(false);
            /// if claim failed to be created
            if (!addedClaimResult.Succeeded)
            {
               /// remove the user account and return appropriate error
               AppDbContext.Users.Remove(newUser);
               await AppDbContext.SaveChangesAsync().ConfigureAwait(false);
               AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
               return StatusCode(417, ErrorsList);
            }
            foreach (string lang in AppConst.SupportLanguages)
            {
               await AppDbContext.UserTranslate.AddAsync(new UserTranslate()
               {
                  LangId = AppFunc.GetLanguageId(lang),
                  User = newUser,
                  FirstName = newUser.FirstName,
                  Surname = newUser.Surname
               });
            }
            /// save the changes to the data base
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);
            isUserCreated = true;
            /// return 201 created status with the new object
            /// and success message
            return Created(_localizer["Success"].Value, newUser);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
