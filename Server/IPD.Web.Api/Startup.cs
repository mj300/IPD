using System;
using System.Linq;

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;

using IPD.Web.Api.CoreFiles;
using IPD.Web.Api.Database;
using IPD.Web.Api.Database.Model;
using IPD.Web.Api.Database.Model.overrides;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Localization.Routing;

namespace IPD.Web.Api
{
   public class Startup
   {
      internal IConfiguration Configuration { get; }
      internal const string AuthSchemeApplication = "Identity.Application";
      public Startup(IConfiguration configuration) => Configuration = configuration;

      // This method gets called by the runtime. Use this method to add services to the container.
      public void ConfigureServices(IServiceCollection services)
      {
         ///// Set the NewtonSoft Json as default json parser for the controllers
         //services.AddControllers();

         /// Enable API calls from different origins
         services.AddCors(options =>
         {
            options.AddPolicy("WebApp",
                builder =>
                {
                   builder.WithOrigins(AppConst.Settings.OpenCors)
                              .AllowAnyMethod()
                              .AllowCredentials()
                              .WithHeaders("Accept",
                              "content-type",
                              "x-antiforgery-token",
                              "Access-Control-Allow-Origin");
                });
         });

         services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");
         /// Add Mvc service to the application
         services.AddLocalization(options => options.ResourcesPath = "Resources");
         services.AddScoped<LanguageActionFilter>();
         services.AddControllers()
                 .AddNewtonsoftJson().AddDataAnnotationsLocalization();
         //.AddViewLocalization()
         //.AddDataAnnotationsLocalization(options =>
         //{
         //   options.DataAnnotationLocalizerProvider = (type, factory) =>
         //   {
         //      var assemblyName = new AssemblyName(typeof(SharedResource).GetTypeInfo().Assembly.FullName);
         //      return factory.Create("SharedResource", assemblyName.Name);
         //   };
         //});

         services.Configure<RequestLocalizationOptions>(
             options =>
             {
                var supportedCultures = new List<CultureInfo>
                     {
                            new CultureInfo("en-US"),
                            new CultureInfo("fa-IR"),
                            new CultureInfo("ar")
                     };

                //RequestCultureProvider requestProvider = options.RequestCultureProviders.OfType<CookieRequestCultureProvider>().First();
                //options.RequestCultureProviders.Remove(requestProvider);
                options.DefaultRequestCulture = new RequestCulture(culture: "fa-IR", uiCulture: "fa-IR");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
                options.RequestCultureProviders.Clear(); // Clears all the default culture providers from the list
                options.RequestCultureProviders.Add(new UserProfileRequestCultureProvider()); // Add your custom culture provider back to the list
             });
         services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
            .AddDataAnnotationsLocalization(options =>
         {
            options.DataAnnotationLocalizerProvider = (type, factory) =>
                factory.Create(typeof(SharedResource));
         });



         //services.Configure<RequestLocalizationOptions>(
         // options =>
         // {
         //    var supportedCultures = new List<CultureInfo>
         //         {
         //                   new CultureInfo("en-US"),
         //                 new CultureInfo("fa-IR")
         //         };

         //    options.DefaultRequestCulture = new RequestCulture(culture: "en-US", uiCulture: "en-US");
         //    options.SupportedCultures = supportedCultures;
         //    options.SupportedUICultures = supportedCultures;
         // });




         string conString = AppConst.Settings.DbConnectionString();
         /// Pass the SQL server connection to the db context
         /// receive the connection string from the package.json
         services.AddDbContext<AppDbContext>(options =>
             options.UseSqlServer(conString).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));

         /// Add .Net Core Identity to the pipe-line with the following options
         services.AddIdentityCore<User>(options =>
         {
            options.ClaimsIdentity.UserIdClaimType = "UserId";
            options.ClaimsIdentity.SecurityStampClaimType = "SecurityStamp";
            options.ClaimsIdentity.RoleClaimType = AppConst.AccessClaimType;
            options.User.RequireUniqueEmail = true;
            options.Password = new PasswordOptions
            {
               RequireDigit = true,
               RequiredLength = 7,
               RequiredUniqueChars = 1,
               RequireLowercase = true,
               RequireNonAlphanumeric = true,
               RequireUppercase = true
            };
         })
         .AddEntityFrameworkStores<AppDbContext>()// Add the custom db context class
         .AddSignInManager<AuthManager<User>>() // add the custom SignInManager class
         .AddDefaultTokenProviders(); // Allow the use of tokens

         services.Replace(ServiceDescriptor.Scoped<IUserValidator<User>, Database.Model.overrides.UserValidator<User>>());

         /// local static function to set the cookie authentication option
         static void CookieAuthOptions(CookieAuthenticationOptions options)
         {
            options.LoginPath = "/Login";
            options.LogoutPath = "/Logout";
            options.AccessDeniedPath = "/AccessDenied";
            options.ClaimsIssuer = "OSnack";
            options.ExpireTimeSpan = TimeSpan.FromDays(60);
            options.SlidingExpiration = true;
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
         }
         /// Add authentication services to the pipeline
         services.AddAuthentication()
            .AddCookie(AuthSchemeApplication, CookieAuthOptions);
         //.AddGoogle(options =>
         //{
         //   options.ClientId = "78803002607-eqki0ohr9viovu2e5q0arpg8on9p8huq.apps.googleusercontent.com";
         //   options.ClientSecret = "fdA-x4FDiddFKlWLDafznjDQ";
         //})
         //.AddFacebook(options =>
         //{
         //   options.AppId = "1237220039954343";
         //   options.AppSecret = "8baeba8706abb793fa9bfd5864ed9212";
         //});

         /// Add Authorization policies for Admin, Manager, Staff and Customer
         services.AddAuthorization(options =>
         {
            options.AddPolicy(AppConst.AccessPolicies.Official, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.RequireAuthenticatedUser();
               policy.RequireClaim(AppConst.AccessClaimType
                                   , new string[] { AccessClaims.Admin.ToString(),
                                                    AccessClaims.Manager.ToString(),
                                                    AccessClaims.Staff.ToString(),
                                                    AccessClaims.Patient.ToString()});
            });
            options.AddPolicy(AppConst.AccessPolicies.Restricted, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.RequireAuthenticatedUser();
               policy.RequireClaim(AppConst.AccessClaimType
                                   , new string[] { AccessClaims.Admin.ToString(),
                                                    AccessClaims.Manager.ToString(),
                                                    AccessClaims.Staff.ToString()});
            });
            options.AddPolicy(AppConst.AccessPolicies.Secret, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.RequireAuthenticatedUser();
               policy.RequireClaim(AppConst.AccessClaimType
                                   , new string[] { AccessClaims.Manager.ToString(),
                                                    AccessClaims.Admin.ToString()});
            });
            options.AddPolicy(AppConst.AccessPolicies.TopSecret, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.RequireAuthenticatedUser();
               policy.RequireClaim(AppConst.AccessClaimType
                                   , new string[] { AccessClaims.Admin.ToString() });
            });
         });

         /// Grab the Smtp server info
         /// and add it as a singleton middle-ware so that the EmailSettings object is
         /// only referring to the same object across requests and classes
         services.AddSingleton(AppConst.Settings.EmailSettings);

         /// Add email service as a Transient service middle-ware so that each class implementing this
         /// middle-ware will receive a new object of oEmailService class
         //services.AddTransient<IEmailService, oEmailService>();

         /// Add MVC services to the pipeline
         services.AddMvc(options => options.EnableEndpointRouting = false);

      }

      // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
      public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
      {
         app.UseRequestLocalization();
         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();
         }
         else
         {
            app.UseHsts();
            app.UseHttpsRedirection();
         }


         app.UseCors("WebApp");


         /// Only the mentioned CORs are allowed except excluded paths
         app.Use(next => context =>
         {
            foreach (var element in AppConst.Settings.ExcludeRouteFromCors)
            {
               if (context.Request.Path.StartsWithSegments(new PathString(element)))
                  return next(context);
            }

            string OrgPath = context.Request.Path;
            context.Request.Path = "/";
            foreach (var COR in AppConst.Settings.OpenCors)
            {
               if (COR.Contains(context.Request.Host.ToString()))
                  context.Request.Path = OrgPath;
            }
            return next(context);
         });

         /// Add the anti-forgery cookie to the context response
         app.Use(next => context =>
         {
            switch (context.Request.Path.Value)
            {
               case "/":
                  AntiforgeryTokenSet tokens = antiforgery.GetAndStoreTokens(context);
                  context.Response.Cookies.Append(
                         "XSRF-TOKEN",
                         tokens.RequestToken,
                         new CookieOptions() { HttpOnly = true });
                  break;
            }
            return next(context);
         });

         /// Enable the application to use authentication
         app.UseAuthentication();

         /// Allow the use of static files from wwwroot folder
         app.UseStaticFiles();

         /// User MVC Routes for the api calls
         app.UseMvc();
      }
   }
}
