import { AccessClaims, API_URL, CommonErrors, AlertTypes } from "../CoreFiles/AppConst";
import { Error, LoginInfo, User, AlertObj } from "../CoreFiles/AppClass";
import { httpCaller, GetCurrentLang } from "../CoreFiles/AppFunc";
import { IAuthenticationReducer } from "../Reducers/AuthenticationReducer";

export const postLogin = (
   userInfo: LoginInfo,
   callBack?: (state: IAuthenticationAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch:
      (arg: IAuthenticationAction) => IAuthenticationAction) => {
      let state: IAuthenticationAction = {
         type: 'LOGIN',
         payload: {
            isAuthenticated: false,
            user: new User(),
         },
         alert: new AlertObj([], AlertTypes.Error),
      };
      let accessClaimFailed = false;
      try {
         const response = await httpCaller.post(`${API_URL}/${GetCurrentLang()}/authentication/Login`, userInfo);
         switch (response?.status) {
            case 200: // Created Response
               await response.json().then((data: User) => state.payload.user = data);
               switch (state.payload.user.role.accessClaim) {
                  case AccessClaims.Admin:
                  case AccessClaims.Manager:
                     state.payload.isAuthenticated = true;
                     break;
                  case AccessClaims.Staff:
                  case AccessClaims.Patient:
                  default:
                     accessClaimFailed = true;
                     state.alert.List.push(CommonErrors.AccessPermissionFailed);
                     break;
               }
               break;
            case 400: //Bad Response
            case 401: //Unauthorized
            case 417: //ExpectationFailed
            case 422: //Unprocessable Entity
               await response.json().then((data: Error[]) => state.alert.List = data);
               break;
            default:
               CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status || CommonErrors.BadServerConnection.value}`;
               state.alert.List.push(CommonErrors.BadServerResponseCode);
               break;
         };
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      if (!accessClaimFailed)
         dispatch(state);
      callBack!(state, ...callBackArgs!);
      return state;
   };
};

export const getLogout = () => {
   return async (dispatch:
      (arg: IAuthenticationAction) => void) => {
      let state: IAuthenticationAction = {
         type: 'LOGIN',
         payload: {
            isAuthenticated: false,
            user: new User(),
         },
         alert: new AlertObj([], AlertTypes.Error),
      };
      try {
         await httpCaller.get("authentication/logout");
         dispatch(state);
      } catch (e) { }
   };
};

export const getSilentAuthentication = (
   currentAuthentication: boolean
) => {
   return async (dispatch:
      (arg: IAuthenticationAction) => void) => {
      let state: IAuthenticationAction = {
         type: 'SILENT_AUTHENTICATION',
         payload: {
            isAuthenticated: false,
            user: new User(),
         },
         alert: new AlertObj([], AlertTypes.Error),
      };
      let accessClaimFailed: boolean = false;
      const response = await httpCaller.get("authentication/silent");
      try {
         switch (response?.status) {
            case 200: // Ok response
               state.payload.isAuthenticated = true;
               await response.json().then((data: User) => state.payload.user = data);
               switch (state.payload.user.role.accessClaim) {
                  case AccessClaims.Admin:
                  case AccessClaims.Manager:
                  case AccessClaims.Staff:
                  case AccessClaims.Patient:
                     state.payload.isAuthenticated = true;
                     break;
                  default:
                     accessClaimFailed = true;
                     break;
               }
               break;
            default:
               break;
         };

         if (currentAuthentication !== state.payload.isAuthenticated && !accessClaimFailed) {
            dispatch(state);
         }
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }

      return state;
   };
};

export declare type IAuthenticationAction = {
   type: string,
   payload: IAuthenticationReducer,
   alert: AlertObj,
};