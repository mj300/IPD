import { httpCaller, asEnum } from 'twomj-core-ts';

export { httpCaller, asEnum };

export const GetCurrentLang = () => {
   return (localStorage.getItem('Language') || "en-US");
};
export const isRtl = () => {
   if (GetCurrentLang() == "en-US")
      return false;
   else
      return true;
};

export const themeIsDark = () => {
   return (localStorage.getItem('DarkTheme') == "true");
};

export const getLogo = () => {
   if (themeIsDark())
      return "/public/Images/logo_dark.png";
   else
      return "/public/Images/logo_light.png";
};