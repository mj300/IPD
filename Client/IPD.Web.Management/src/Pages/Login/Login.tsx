import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, PageHeader, Alert, Input, CheckBox, Button, RF, Modal } from 'twomj-components-react';
import { postLogin, getSilentAuthentication, getLogout, IAuthenticationAction } from '../../Actions/AuthenticationAction';
import { LoginInfo } from '../../CoreFiles/AppClass';
//import { GoogleLogin } from 'react-google-login';
import { IAuthenticationReducer } from '../../Reducers/AuthenticationReducer';
import { IReduxStoreState } from '../../Reducers';
import ForgotPassword from './ForgotPassword';
import NewCustomer from './NewCustomer';
import { PurifyComponent, CommonRegex } from 'twomj-core-ts';
import i18next from "i18next";



class Login extends PurifyComponent<IProps> {
   myState = {
      loginInfo: new LoginInfo(),
      forgotPasswordModalIsOpen: false,
      newCustomerModalIsOpen: false,
   };
   constructor(props: IProps) {
      super(props);
      this.login = this.login.bind(this);
   }
   async componentDidMount() {
   };
   async login() {
      await this.props.postLogin(
         this.myState.loginInfo,
         (result: IAuthenticationAction) =>
            this.reRender(() => this.alert = result.alert)
      );
   }
   render() {
      /// If user is authenticated then redirect the user to home page
      if (this.props.Authentication.isAuthenticated) {
         try {
            return (<Redirect to={this.props.location.state.fromPath || "/"} />);
         } catch (e) {
            return (<Redirect to="/" />);
         }
      }
      return (
         <div className="container custom-container">
            <Row className="justify-content-md-center">
               <div className="col-md-7 col-lg-5 p-1">
                  <PageHeader title={i18next.t('Login.Login')} className="text-center" />
                  <Input lblText={i18next.t('Login.UserName')} keyVal="txtUserName"
                     bindedValue={this.myState.loginInfo.userName}
                     error={this.alert.checkExist("userName")}
                     errorText={this.alert.getError("userName")}
                     onChange={i =>
                        this.myState.loginInfo.userName = i.target.value}
                  />
                  <Input lblText={i18next.t('Login.Password')} type="password" keyVal="txtPassword"
                     error={this.alert.checkExist("Password")}
                     errorText={this.alert.getError("Password")}
                     enterPressed={this.login}
                     bindedValue={this.myState.loginInfo.password}
                     onChange={i =>
                        this.myState.loginInfo.password = i.target.value}
                  />

                  <div className="pt-3">
                     <a onClick={() => this.reRender(() => this.myState.forgotPasswordModalIsOpen = true)}
                        className="col-6 c-float-right"
                        children={i18next.t('Login.ForgotPassword')}
                     />

                     <CheckBox lblText={i18next.t('Login.RememberMe')} className="col-6 c-float-left" keyVal="rememberMe"
                        onChange={i =>
                           this.myState.loginInfo.rememberMe = Boolean(i.target.value)}
                     />
                  </div>

                  <Alert alert={this.alert} excludeKey={["Password", "userName"]}
                     className="col-12 pt-3"
                     onClosed={() => this.reRender(() => this.alert.List = [])}
                  />
                  <div className="pt-4">
                     <Button children={i18next.t('Login.Login')} className="col-12 btn-lg" btnclassName="btn-lg btn-submit" onClick={this.login} />
                     {/* <GoogleLogin
                     clientId="721733196080-9i5jspufdn9ffo26iul1g3g177iv8e0m.apps.googleusercontent.com"
                     buttonText="Google Login"
                     onSuccess={(test: any) => console.log(test)}
                     onFailure={(test: any) => console.log(test)}
                     cookiePolicy={'single_host_origin'}
                     className="col-6 btn-lg btn btn-g "
                  />*/  }

                     <Button children={i18next.t('Login.NewUser')} className="col-12 pt-2 btn-lg" btnclassName="btn-create"
                        onClick={() => this.reRender(() =>
                           this.myState.newCustomerModalIsOpen = !this.myState.newCustomerModalIsOpen)}
                     />
                  </div>
               </div>
            </Row>
            <ForgotPassword isOpen={this.myState.forgotPasswordModalIsOpen}
               onCancel={() => this.reRender(() => this.myState.forgotPasswordModalIsOpen = false)}
               email={this.myState.loginInfo.userName}
            />
            <NewCustomer isOpen={this.myState.newCustomerModalIsOpen}
               onCancel={() => this.reRender(() => this.myState.newCustomerModalIsOpen = false)}
               email={this.myState.loginInfo.userName}
            />
         </div>
      );
   }
}
declare type IProps = {
   location: any,
   Authentication: IAuthenticationReducer,
   getLogout: typeof getLogout,
   postLogin: typeof postLogin,
   getSilentAuthentication: typeof getSilentAuthentication,
};
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
      postLogin,
      getLogout,
      getSilentAuthentication,
   }, dispatch)
)(Login);