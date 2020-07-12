import { Role, AlertObj, Error } from "../CoreFiles/AppClass";
import { AlertTypes, ConstMaxNumberOfPerItemsPage } from "../CoreFiles/AppConst";
import { httpCaller, GetCurrentLang } from "../CoreFiles/AppFunc";
import { API_URL, CommonErrors } from "../CoreFiles/AppConst";


export const getAllRoles = (
   callBack: (state: IRoleAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IRoleAction) => IRoleAction) => {
      let state: IRoleAction = {
         payload: { list: [], totalCount: 0 },
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.get(`${API_URL}/${GetCurrentLang()}/Role/Get/All`);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: Role[]) => {
                  (state.payload as IRoleList).list = data;
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



export const getRoles = (
   selectedPage = 1,
   maxNumberPerItemsPage = ConstMaxNumberOfPerItemsPage,
   searchValue = "",
   filterAccessClaim = "",
   isSortAsce = true,
   selectedSortName = "Role.Name",
   callBack: (state: IRoleAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IRoleAction) => IRoleAction) => {
      let state: IRoleAction = {
         payload: { list: [], totalCount: 0 },
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.get(`${API_URL}/${GetCurrentLang()}/Role/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}/${filterAccessClaim}/${isSortAsce}/${selectedSortName}`);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: IRoleList) => {
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

export const postRole = (
   newRole = new Role(),
   callBack: (state: IRoleAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IRoleAction) => IRoleAction) => {
      let state: IRoleAction = {
         payload: new Role(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.post(`${API_URL}/${GetCurrentLang()}/Role/Post`, newRole);
         switch (response?.status) {
            case 201: // Created Response
               await response.json().then((data: Role) => {
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

export const putRole = (
   modifyRole = new Role(),
   callBack: (state: IRoleAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IRoleAction) => IRoleAction) => {
      let state: IRoleAction = {
         payload: new Role(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.put(`${API_URL}/${GetCurrentLang()}/Role/Put`, modifyRole);
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: Role) => {
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

export const deleteRole = (
   role = new Role(),
   callBack: (state: IRoleAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IRoleAction) => IRoleAction) => {
      let state: IRoleAction = {
         payload: false,
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.delete(`${API_URL}/${GetCurrentLang()}/Role/Delete`, role);
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


export declare type IRoleAction = {
   payload: IRoleList | Role | boolean;
   alert: AlertObj;
};

export declare type IRoleList = {
   list: Role[],
   totalCount: number;
};


