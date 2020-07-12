import '../public/css/TwoMJ-bootstrap.css';
//import '../public/css/main.css';
//import '../public/css/temp.css';
import '../public/css/main.scss';
import React from 'react';
import { Switch } from 'react-router';
//import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
//import CssBaseline from '@material-ui/core/CssBaseline';

// Main Components such as pages, navbar, footer
import ProtectedRoute from './CoreFiles/ProtectedRoute';
import CustomRoute from './CoreFiles/CustomRoute';
import NavMenu from './Components/NavMenu/NavMenu';
import Home from './Pages/Home/Home';
import RoleManagement from './Pages/Role/RoleManagement';
import Login from './Pages/Login/Login';
import PageNotFound from './Pages/Error/PageNotFound';
import Footer from './Components/Footer';
import { Container, Row } from 'twomj-components-react';
import UserManagement from './Pages/User/UserManagement';
import i18next from 'i18next';
import { IReduxStoreState } from './Reducers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLang } from './Actions/LanguageAction';
import { PurifyComponent } from 'twomj-core-ts';
import { GetCurrentLang, themeIsDark, isRtl } from './CoreFiles/AppFunc';


class App extends PurifyComponent<IProps> {
   myState = {
      prefersDarkMode: themeIsDark(),
      refresh: true
   };
   constructor(props: any) {
      super(props);
      this.changeLang = this.changeLang.bind(this);
      let lang: string = GetCurrentLang()?.split("-")[0] || "en";
      i18next.changeLanguage(lang).then(() => {
         i18next.options.lng = lang;
         i18next.t('key');
         this.props.setLang();
         isRtl() ? document.body.classList.add("rtl") : document.body.classList.remove("rtl");
         this.forceUpdate();
      });
   }
   changeLang(lang: string): any {
      i18next.changeLanguage(lang).then(() => {
         i18next.options.lng = lang;
         i18next.t('key');
         this.myState.refresh = !this.myState.refresh;
         this.props.setLang();
         isRtl() ? document.body.classList.add("rtl") : document.body.classList.remove("rtl");
         this.forceUpdate();
      });

   }

   render() {
      return (
         <div>
            <NavMenu onlangChange={this.changeLang}
               onDarkModeChaneg={(val) => this.reRender(() => {
                  this.myState.prefersDarkMode = val;
                  localStorage.setItem("DarkTheme", val.toString());
               })} />
            <Container className="custom-container">
               <Row className="col-12 col-md-11 col-lg-10 p-3 mt-4 mb-3 ml-auto mr-auto">
                  <Switch>

                     {/***** Public Routes  ****/}
                     <CustomRoute exact path='/' Render={(props: any) => <Home {...props} />} />
                     <CustomRoute exact path='/Login' Render={(props: any) => <Login {...props} />} />
                     <CustomRoute exact path='/AboutUs' Render={(props: any) => <Login {...props} />} />
                     <CustomRoute exact path='/Role' Render={() => <RoleManagement refresh={this.myState.refresh} />} />
                     <CustomRoute exact path='/User' Render={() => <UserManagement refresh={this.myState.refresh}/>} />
                     {/**     <CustomRoute path='/ResetPassword' Render={props => <Login {...props} />} />
            <CustomRoute exact path='/Privacy' Render={props => <Privacy {...props} />} />
            <CustomRoute path='/Shop' Render={props => <Store {...props} />} />
            <CustomRoute exact path='/Checkout' Render={props => <Checkout {...props} />} />
              */}
                     {/***** Protected Routes ****/}
                     {/** <ProtectedRoute exact path='/MyAccount' Render={props => <MyAccount {...props} />} />
            <ProtectedRoute exact path='/MyOrders' Render={props => <MyOrder {...props} />} />
                   */}
                     {/***** Other Routes ****/}
                     <CustomRoute path='*' Render={(props: any) => <PageNotFound {...props} />} />

                  </Switch>
               </Row>
            </Container >
            <Footer />
         </div>
      );
   }
};

export default connect(
   (state: IReduxStoreState) => {
      return {

      };
   },
   dispatch => bindActionCreators({ setLang }, dispatch)
)(App);


declare type IProps = {
   setLang: typeof setLang;
};