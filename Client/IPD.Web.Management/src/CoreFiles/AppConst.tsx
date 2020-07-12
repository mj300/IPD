import {
   AlertTypes, CommonRegex,
   ConstMaxNumberOfPerItemsPage, Error,
   GetAllRecords
} from 'twomj-core-ts';
import { Lang } from './AppClass';

export { AlertTypes, CommonRegex, ConstMaxNumberOfPerItemsPage, GetAllRecords };


//#region *** *** AccessClaims *** ***
export const AccessClaims = {
   Admin: "Admin",
   Manager: "Manager",
   Patient: "Patient",
   Staff: "Staff",
   None: "",
   List: [
      { id: 0, name: "Admin" },
      { id: 1, name: "Manager" },
      { id: 2, name: "Staff" },
      { id: 3, name: "Patient" },
   ]
};

//#endregion

//#region *** *** Common URLs *** ***

export const CURRENT_URL: string = window.location.href;
export const LOGO_URL: string = "/public/Images/Logo.png";
export const API_URL: string = "https://localhost:44316";
export const WEB_URL: string = "http://localhost:8080";

//#endregion

export class CommonErrors {
   public static BadServerResponse: Error = new Error("ConnectionError", "Bad Server Response.");
   public static BadServerResponseCode: Error = new Error("ConnectionError", "Server Error Code: 000");
   public static BadServerConnection: Error = new Error("ConnectionError", "Cannot connect to server.");
   public static AccessPermissionFailed: Error = new Error("ConnectionError", "You do not have the right access permission. please contact administrator for more information.");
};
//#region *** *** Language *** ***

export const LanguageList: Lang[] = [
   new Lang("English", "en-US"),
   new Lang("Arabic", "ar"),
   new Lang("فارسی", "fa-IR")];
//#endregion