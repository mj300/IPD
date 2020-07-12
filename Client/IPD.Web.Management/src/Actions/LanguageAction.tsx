import { httpCaller, GetCurrentLang } from "../CoreFiles/AppFunc";
import { API_URL } from "../CoreFiles/AppConst";


export const setLang = (
   callBack: (state: any, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: any) => any) => {
      const response = await httpCaller.get(`${API_URL}/${GetCurrentLang()}/Language/get`);
      callBack!(response, ...callBackArgs!);
      return response;
   };

};
