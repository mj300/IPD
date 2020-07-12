import React from "react";
import { Collapse, ToggleSwitch, Row } from "twomj-components-react";
import { Link } from "react-router-dom";
import i18next from "i18next";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AccessClaims } from "../../CoreFiles/AppConst";
import { DefaultNav, LoginNav, INavItem } from './NavMenuItems';

import { getLogout } from "../../Actions/AuthenticationAction";
import { IAuthenticationReducer } from "../../Reducers/AuthenticationReducer";
import { PurifyComponent } from "../../CoreFiles/AppClass";
import { Language } from "../Language";
import { getLogo, themeIsDark } from "../../CoreFiles/AppFunc";

// Navigation menu component
class NavMenu extends PurifyComponent<IProps> {
   myState: IMyState = {
      toggleContainerNavBar: React.createRef(),
      toggleContainerDropdown: React.createRef(),
      smScreenNavIsOpen: false,
      myAccDropdownBool: false,
      refreshNavItems: true,
      CurrentNavItems: [],
      selectedNav: window.location.pathname,
      darkMode: themeIsDark()
   };
   constructor(props: IProps) {
      super(props);
      this.myState.darkMode ? document.body.classList.add("dark") : document.body.classList.remove("dark");
      this.logout = this.logout.bind(this);
      this.toggleNavbar = this.toggleNavbar.bind(this);
      this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);


   }

   componentDidMount() {
      window.addEventListener("click", this.onClickOutsideHandler);
   }
   componentWillUnmount() {
      window.removeEventListener("click", this.onClickOutsideHandler);
   }
   onClickOutsideHandler(event: any) {
      const { myAccDropdownBool, smScreenNavIsOpen, toggleContainerDropdown, toggleContainerNavBar } = this.myState;
      // only if the drop-down menu is activated and the user clicks away from the menu
      try {
         if (myAccDropdownBool && !toggleContainerDropdown.current?.contains(event.target))
            this.reRender(() => this.myState.smScreenNavIsOpen = false);
      } catch (e) { }

      // close Navigation menu in small screen when user clicks away from the menu (When user is logged in)
      // this is used so that the navigation menu is not closed when the drop-down items are selected
      try {
         if (smScreenNavIsOpen && !toggleContainerDropdown.current?.contains(event.target)
            && !toggleContainerNavBar.current?.contains(event.target))
            this.reRender(() => this.myState.smScreenNavIsOpen = !smScreenNavIsOpen);
      } catch (e) {
         // if the user is NOT logged in the error is thrown
         // then try to hide the navigation menu in small screen
         try {
            if (smScreenNavIsOpen && !this.myState.toggleContainerNavBar.current?.contains(event.target))
               this.reRender(() => this.myState.smScreenNavIsOpen = !smScreenNavIsOpen);
         } catch (e) { }
      }
   }
   toggleNavbar() {
      this.reRender(() => this.myState.smScreenNavIsOpen = !this.myState.smScreenNavIsOpen);
   }

   async logout() {
      await this.props.getLogout();
      this.reRender(() => {
         this.myState.CurrentNavItems = DefaultNav;
         this.myState.refreshNavItems = false;
      });
   }
   render() {
      if (this.myState.refreshNavItems) {
         /// Check which menu items to show for the user
         switch (this.props.Authentication.user.role.accessClaim) {
            case AccessClaims.Admin:
            case AccessClaims.Manager:
            case AccessClaims.Staff:
            case AccessClaims.Patient:
               this.myState.CurrentNavItems = LoginNav;
               break;
            default:
               this.myState.CurrentNavItems = DefaultNav;
               break;
         }
      } else {
         this.myState.refreshNavItems = true;
      }
      return (
         <header>
            <div ref={this.myState.toggleContainerNavBar}
               className="navbar-light navbar  bg-transparent navbar-expand-md navbar-toggleable-md mb-3 mt-0 pt-0">
               {/* Logo */}
               <Link to="/" className="logo-container navbar-brand mt-3 mt-sm-0"
                  children={<img src={getLogo()} alt="IPD" className="Logo" />}
               />
               {/* Small screen nav-bar toggle */}
               <button className="navbar-toggler w-auto float-right" type="button">
                  <i className={`fas fa-times ${this.myState.smScreenNavIsOpen ? "toggler-show fa-3x fa-rotate-180" : "toggler-hide"}`}
                     onClick={this.toggleNavbar} />

                  <i className={`fas fa-bars ${!this.myState.smScreenNavIsOpen ? "toggler-show fa-3x fa-rotate-180" : "toggler-hide"}`}
                     onClick={this.toggleNavbar} />
               </button>
               <Row className="w-100">
                  <Row className="navbar-toggler d-md-inline-flex flex-md-row col mt-4 ml-5">
                     <Language onChange={this.props.onlangChange} />
                     <ToggleSwitch className="p-0 m-0"
                        bindedValue={this.myState.darkMode}
                        onChange={i => this.reRender(() => {
                           this.myState.darkMode = i.target.checked;
                           localStorage.setItem("DarkTheme", i.target.checked.toString());
                           i.target.checked ? document.body.classList.add("dark") : document.body.classList.remove("dark");
                        })} />
                  </Row>
                  {/* Navbar items */}
                  <Collapse isOpen={this.myState.smScreenNavIsOpen}
                     className="navbar-toggler rtlSupport d-md-inline-flex flex-md-row col mt-4 " >
                     <div className="ml-auto rtlvisible-none" />

                     {/* user links */}
                     {this.myState.CurrentNavItems.map(link =>
                        <Link key={link.id}
                           // children="XX"
                           className={`navbar text-nav text-center ${this.myState.selectedNav === link.path ? "text-nav-visited" : ""} `}
                           to={() => {
                              if (this.myState.selectedNav !== window.location.pathname) {
                                 this.myState.selectedNav = window.location.pathname;
                                 this.forceUpdate();
                              }
                              return link.path;
                           }}
                        >{i18next.t(`NavMenu.${link.displayName}`)}</Link>
                     )}
                     {this.props.Authentication.isAuthenticated &&
                        <div className="dropdown" ref={this.myState.toggleContainerDropdown}>
                           <a className={`text-nav navbar align-middle text-underline dropdown-toggle`}
                              onClick={() => {
                                 this.myState.myAccDropdownBool = !this.myState.myAccDropdownBool;
                                 this.forceUpdate();
                              }}
                              children="My Account"
                           />
                           {this.myState.myAccDropdownBool && (
                              <span className={"dropdown-menu text-center dropdown-menu-right dropdown-span show"}>
                                 <Link className={`dropdown-item text-nav`} key="0"
                                    to="/MyOrders"
                                    children="Orders" />
                                 <Link className={`dropdown-item text-nav`} key="1"
                                    to="/MyAccount"
                                    children="Account" />

                                 <a className={`dropdown-item text-nav`} key="2"
                                    onClick={this.logout}
                                    children='Logout' />
                              </span>
                           )}
                        </div>
                     }
                  </Collapse>

               </Row>
            </div>
         </header >
      );
   }
}

declare type IMyState = {
   toggleContainerNavBar: React.RefObject<HTMLDivElement>;
   toggleContainerDropdown: React.RefObject<HTMLDivElement>;
   smScreenNavIsOpen: boolean;
   myAccDropdownBool: boolean;
   refreshNavItems: boolean;
   CurrentNavItems: INavItem[];
   selectedNav: string;
   darkMode: boolean;
};
declare type IProps = {
   onlangChange: (value: string) => void;
   onDarkModeChaneg: (value: boolean) => void;
   getLogout: typeof getLogout,
   Basket: [],
   Authentication: IAuthenticationReducer;
};
export default connect(
   (state: any) => {
      return {
         Authentication: state.Authentication,
         Basket: state.Basket
      };
   },
   (dispatch) => bindActionCreators(
      {
         getLogout
      }, dispatch))
   (NavMenu);