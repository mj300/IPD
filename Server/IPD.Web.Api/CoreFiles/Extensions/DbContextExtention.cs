using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace IPD.Web.Api.CoreFiles.Extensions
{
   public static class DbContextExtention
   {
      /// <summary>
      /// Order By FieldName
      /// </summary>
      /// <typeparam name="T"></typeparam>
      /// <param name="list">IQueryable List</param>
      /// <param name="SortField">FieldName</param>
      /// <param name="isAscending">Ascending</param>
      /// <returns></returns>
      public static IQueryable<T> OrderByDynamic<T>(this IQueryable<T> list, string SortField, bool isAscending)
      {
         try
         {
            var param = Expression.Parameter(typeof(T), "p");
            MemberExpression propParent = null;
            MemberExpression prop = null;
            if (SortField.Contains("."))
            {
               foreach (var item in SortField.Split('.'))
               {
                  if (SortField.Split('.').Last() != item)
                     if (propParent != null)
                        propParent = Expression.Property(propParent, item);
                     else
                        propParent = Expression.Property(param, item);
                  else
                     prop = Expression.Property(propParent, item);
               }

            }
            else
               prop = Expression.Property(param, SortField);
            var exp = Expression.Lambda(prop, param);
            string method = isAscending ? "OrderBy" : "OrderByDescending";
            Type[] types = new Type[] { list.ElementType, exp.Body.Type };
            var mce = Expression.Call(typeof(Queryable), method, types, list.Expression, exp);
            return list.Provider.CreateQuery<T>(mce);
         }
         catch (Exception)
         {
            return list;
         }
      }
   }
}
