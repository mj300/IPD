using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;

using IPD.Web.Api.CoreFiles;
using IPD.Web.Api.CoreFiles.Extensions;
using IPD.Web.Api.Database;
using IPD.Web.Api.Database.Model;

namespace IPD.Web.Api.Controllers
{
   [ServiceFilter(typeof(LanguageActionFilter))]
   [Route("{culture}/[controller]")]
   public class RoleController : ControllerBase
   {
      private readonly IStringLocalizer<RoleController> _localizer;
      private AppDbContext AppDbContext { get; }
      private List<Error> ErrorsList = new List<Error>();

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      public RoleController(AppDbContext db, IStringLocalizer<RoleController> localizer)
      {
         AppDbContext = db;
         _localizer = localizer;
      }

      /// <summary>
      /// Get all the Roles.
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/All")]
      // [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Get()
      {
         try
         {
            int langId = AppFunc.GetLanguageId();
            /// return the list of All Roles
            return Ok(await AppDbContext.Roles.Include(r => r.RoleTranslates).Select(p => new Role
            {
               Name = p.RoleTranslates.FirstOrDefault(e => e.LangId == langId).Name,
               AccessClaim = p.AccessClaim,
               Id = p.Id
            }).ToListAsync().ConfigureAwait(false));
         }
         catch (Exception) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Search or get all the Roles.
      /// search by name or filter by access claim
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{selectedPage}/{maxItemsPerPage}/{searchValue}/" +
         "{filterAccessClaim}/{isSortAsce}/{sortName}")]
      // [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Get(
          int selectedPage,
          int maxItemsPerPage,
          string searchValue = "",
          string filterAccessClaim = "",
          bool isSortAsce = true,
          string sortName = "Role.Name")
      {
         try
         {
            int langId = AppFunc.GetLanguageId();

            int totalCount = await AppDbContext.Roles.Where(r => filterAccessClaim.Equals(AppConst.GetAllRecords) ? true : r.AccessClaim.Equals(filterAccessClaim))
                     .Include(r => r.RoleTranslates).Select(p => new Role
                     {
                        Name = p.RoleTranslates.FirstOrDefault(e => e.LangId == langId).Name,
                        AccessClaim = p.AccessClaim,
                        Id = p.Id
                     })
                .CountAsync(r => searchValue.Equals(AppConst.GetAllRecords) ? true : (r.Name.Contains(searchValue)))
                .ConfigureAwait(false);

            List<Role> list = await AppDbContext.Roles
                  .Where(r => filterAccessClaim.Equals(AppConst.GetAllRecords) ? true : r.AccessClaim.Equals(filterAccessClaim)).Include(r => r.RoleTranslates).Select(p => new Role
                  {
                     Name = p.RoleTranslates.FirstOrDefault(e => e.LangId == langId).Name,
                     AccessClaim = p.AccessClaim,
                     Id = p.Id
                  })
                .Where(r => searchValue.Equals(AppConst.GetAllRecords) ? true : (r.Name.Contains(searchValue)))
                .OrderByDynamic(sortName, isSortAsce)
                .Skip((selectedPage - 1) * maxItemsPerPage)
                .Take(maxItemsPerPage)
                .ToListAsync()
                .ConfigureAwait(false);
            /// return the list of Roles
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
      ///     Create a new Role
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [HttpPost("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      // [Authorize(AppConst.AccessPolicies.Secret)]  /// Done
      public async Task<IActionResult> Post([FromBody] Role newRole)
      {
         try
         {
            int langId = AppFunc.GetLanguageId();
            /// if model validation failed
            if (!TryValidateModel(newRole))
            {
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }




            /// check the database to see if a role with the same name exists
            if (await AppDbContext.Roles.Include(r => r.RoleTranslates).Select(p => new Role
            {
               Name = p.RoleTranslates.FirstOrDefault(e => e.LangId == langId).Name,
               AccessClaim = p.AccessClaim,
               Id = p.Id
            }).AnyAsync(d => d.Name.Equals(newRole.Name) && d.AccessClaim.Equals(newRole.AccessClaim)).ConfigureAwait(false))
            {
               /// extract the errors and return bad request containing the errors
               AppFunc.Error(ref ErrorsList, _localizer["Role already exists."].Value);
               return StatusCode(412, ErrorsList);
            }
            foreach (string lang in AppConst.SupportLanguages)
            {
               newRole.RoleTranslates.Add(new RoleTranslate() { LangId = AppFunc.GetLanguageId(lang), Name = newRole.Name });
            }
            /// else role object is made without any errors
            /// Add the new role to the EF context
            await AppDbContext.Roles.AddAsync(newRole).ConfigureAwait(false);

            /// save the changes to the data base
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 201 created status with the new object
            /// and success message
            return Created(_localizer["Success"].Value, newRole);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Update a modified Role
      /// </summary>
      #region *** 200 OK, 304 NotModified,412 PreconditionFailed ,422 UnprocessableEntity, 417 ExpectationFailed***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      // [Authorize(AppConst.AccessPolicies.Secret)]  /// Done
      public async Task<IActionResult> Put([FromBody] Role modifiedRole)
      {
         try
         {
            int langId = AppFunc.GetLanguageId();
            /// if model validation failed
            if (!TryValidateModel(modifiedRole))
            {
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            /// check the database to see if a Category with the same name exists
            if (await AppDbContext.Roles.Include(r => r.RoleTranslates).Select(p => new Role
            {
               Name = p.RoleTranslates.FirstOrDefault(e => e.LangId == langId).Name,
               AccessClaim = p.AccessClaim,
               Id = p.Id
            }).AnyAsync(d => d.Name == modifiedRole.Name &&
             d.AccessClaim.Equals(modifiedRole.AccessClaim) &&
            d.Id != modifiedRole.Id).ConfigureAwait(false))
            {
               /// extract the errors and return bad request containing the errors
               AppFunc.Error(ref ErrorsList, _localizer["Role already exists."].Value);
               return StatusCode(412, ErrorsList);
            }
            modifiedRole.RoleTranslates = await AppDbContext.RolesTranslate
               .Where(rt => rt.Role.Id == modifiedRole.Id).ToListAsync().ConfigureAwait(false);
            modifiedRole.RoleTranslates.SingleOrDefault(rt => rt.LangId == langId).Name = modifiedRole.Name;
            /// else Role object is made without any errors
            /// Update the current Role on EF context
            AppDbContext.Roles.Update(modifiedRole);

            /// save the changes to the data base
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(modifiedRole);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Delete Role
      /// </summary>
      #region *** 200 OK,417 ExpectationFailed, 400 BadRequest,404 NotFound,412 PreconditionFailed ***
      [HttpDelete("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      //[Authorize(AppConst.AccessPolicies.Secret)]  /// Done
      public async Task<IActionResult> Delete([FromBody] Role role)
      {
         try
         {
            /// if the Category record with the same id is not found
            if (!await AppDbContext.Roles.AnyAsync(d => d.Id == role.Id).ConfigureAwait(false))
            {
               AppFunc.Error(ref ErrorsList, _localizer["Role not found."].Value);
               return NotFound(ErrorsList);
            }

            /// If the category is in use by any product then do not allow delete
            if (await AppDbContext.Users.AnyAsync(c => c.Role.Id == role.Id).ConfigureAwait(false))
            {
               AppFunc.Error(ref ErrorsList, _localizer["Failed. Role is in use by at least one user."].Value);
               return StatusCode(412, ErrorsList);
            }

            /// else the role is found
            /// now delete the role record
            AppDbContext.Roles.Remove(role);

            /// save the changes to the database
            await AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 200 OK status
            return Ok(String.Format(_localizer["{0} was deleted"].Value, role.Name));
         }
         catch (Exception)
         {
            /// Add the error below to the error list
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
