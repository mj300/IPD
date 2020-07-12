import { User } from "../CoreFiles/AppClass";
import { IAuthenticationAction } from "../Actions/AuthenticationAction";

const AuthenticationReducer = (state: IAuthenticationReducer = {
   isAuthenticated: false,
   user: new User(),
}, action: IAuthenticationAction) => {

   switch (action.type) {
      case "LOGIN":
      case "LOGOUT":
      case "SILENT_AUTHENTICATION":
      case "TOKEN_AUTHENTICATION":
         return action.payload;
      default:
         return state;
   }
};
export default AuthenticationReducer;

export declare type IAuthenticationReducer = {
   isAuthenticated: boolean,
   user: User,
};