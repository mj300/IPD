import { User, AlertObj, Error } from "../CoreFiles/AppClass";
import { API_URL, CommonErrors, AlertTypes, ConstMaxNumberOfPerItemsPage, GetAllRecords } from "../CoreFiles/AppConst";
import { httpCaller, GetCurrentLang } from "../CoreFiles/AppFunc";
import { IAuthenticationAction } from "./AuthenticationAction";


export const getUsers = (
   selectedPage = 1,
   maxNumberPerItemsPage = ConstMaxNumberOfPerItemsPage,
   searchValue = GetAllRecords,
   filterRoleValue = GetAllRecords,
   isSortAsce = true,
   selectedSortName = "Name",
   callBack: (state: IUserAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IUserAction) => IUserAction) => {
      let state: IUserAction = {
         payload: { list: [], totalCount: 0 },
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.get(`${API_URL}/${GetCurrentLang()}/User/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}/${filterRoleValue}/${isSortAsce}/${selectedSortName}`);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: IUserList) => {
                  state.payload = data;
               });
               break;
            case 422: //Unprocessable Entity
            case 412: //Precondition Failed
            case 417: //Expectation Failed
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
      //dispatch(state)
      return state;
   };
};

export const postUser = (
   newUser = new User(),
   callBack?: (state: IUserAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IUserAction) => IUserAction) => {
      let state: IUserAction = {
         payload: new User(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         if (newUser.role.id == null)
            newUser.role.id = 0;
         const response = await httpCaller.post(`${API_URL}/${GetCurrentLang()}/User/Post/Employee`, newUser);

         switch (response?.status) {
            case 201: // Created Response
               await response.json().then((data: User) => {
                  state.payload = data;
               });
               break;
            case 422: //Unprocessable Entity
            case 412: //Precondition Failed
            case 417: //Expectation Failed)
               await response.json().then((data: any) => {
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

export const putTokenPasswordRest = (
   token = "",
   password = "",
   callBack?: (state: IUserAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IAuthenticationAction) => IAuthenticationAction) => {
      let state: IUserAction = {
         payload: new User(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.put(`${API_URL}/User/Put/TokenPasswordRest`, { token, password });
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: User) => {
                  state.payload = data;
               });
               dispatch({
                  type: 'TOKEN_AUTHENTICATION',
                  payload: {
                     isAuthenticated: false,
                     user: new User(),
                  },
                  alert: new AlertObj([], AlertTypes.Error),
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

export const putUser = (
   modifiedUser = new User(),
   callBack?: (state: IUserAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IAuthenticationAction) => IAuthenticationAction) => {
      let state: IUserAction = {
         payload: new User(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.put(`${API_URL}/${GetCurrentLang()}/User/Put`, modifiedUser);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: User) => {
                  state.payload = data;
               });
               break;
            case 412: //Precondition Failed
            case 422: //Unprocessable Entity
            case 404: //Not Found
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

export const putPassword = (
   currentPassword = "",
   password = "",
   callBack?: (state: IUserAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IAuthenticationAction) => IAuthenticationAction) => {
      let state: IUserAction = {
         payload: new User(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.put(`${API_URL}/${GetCurrentLang()}/User/PutMyPassword/${currentPassword}/${password}`);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: User) => {
                  state.payload = data;
               });
               break;
            case 412: //Precondition Failed
            case 422: //Unprocessable Entity
            case 404: //Not Found
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

export const deleteUser = (
   user = new User(),
   callBack: (state: IUserAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IUserAction) => IUserAction) => {
      let state: IUserAction = {
         payload: false,
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.delete(`${API_URL}/${GetCurrentLang()}/User/Delete`, user);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: string) => {
                  state.alert = new AlertObj([new Error("delete", data)], AlertTypes.Success);
               });
               state.payload = true;
               break;
            case 422: //Unprocessable Entity
            case 412: //Precondition Failed
            case 417: //Expectation Failed
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
      //dispatch(state)
      return state;
   };
};

export declare type IUserAction = {
   payload: IUserList | User | boolean;
   alert: AlertObj;
};

export declare type IUserList = {
   list: User[],
   totalCount: number;
};


