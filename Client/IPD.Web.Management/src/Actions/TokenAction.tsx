import { httpCaller } from '../CoreFiles/AppFunc';
import { Error, AlertObj } from '../CoreFiles/AppClass';
import { AlertTypes, API_URL, CommonErrors } from '../CoreFiles/AppConst';

export const getIsTokenValid = (
   token = "",
   callBack?: (state: ITokenAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: ITokenAction) => ITokenAction) => {
      let state: ITokenAction = {
         payload: false,
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.get(`${API_URL}/Token/Get/IsTokenValid/${token}`);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: any) => {
                  state.payload = data.isTokenValid;
               });
               break;
            case 412: //Precondition Failed
            case 417: //Expectation Failed)
               await response.json().then((data: Error[]) => {
                  state.alert.List = data;
               });
               break;
            default:
               CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
               state.alert.List.push(CommonErrors.BadServerResponseCode);
               break;
         };
         if (response == null)
            state.alert.List.push(CommonErrors.BadServerConnection);
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      callBack!(state, ...callBackArgs);
      return state;
   };
};
export const postPasswordResetRequest = (
   email = "",
   callBack?: (state: ITokenAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: ITokenAction) => ITokenAction) => {
      let state: ITokenAction = {
         payload: false,
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.post(`${API_URL}/Token/Post/PasswordResetRequest`, email);
         switch (response?.status) {
            case 201: // Created Response
               await response.json().then((data: any) => {
                  state.payload = data.isTokenSent;
               });
               break;
            case 412: //Precondition Failed
            case 417: //Expectation Failed)
               await response.json().then((data: Error[]) => {
                  state.alert.List = data;
               });
               break;
            default:
               CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
               state.alert.List.push(CommonErrors.BadServerResponseCode);
               break;
         };
         if (response == null)
            state.alert.List.push(CommonErrors.BadServerConnection);
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      callBack!(state, ...callBackArgs!);
      return state;
   };
};

export declare type ITokenAction = {
   payload: boolean;
   alert: AlertObj;
}

   ;