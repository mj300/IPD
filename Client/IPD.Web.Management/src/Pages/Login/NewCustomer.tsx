import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
   Row, Modal,
   PageHeader, Alert,
   Input, CheckBox, Button
} from 'twomj-components-react';
import { User } from '../../CoreFiles/AppClass';
import { Error, PurifyComponent, AlertObj } from '../../CoreFiles/AppClass';
import { AlertTypes, CommonRegex } from '../../CoreFiles/AppConst';
import { postUser, IUserAction } from '../../Actions/UserAction';
import { Redirect } from 'react-router-dom';
import { IReduxStoreState } from '../../Reducers';

class NewCustomer extends PurifyComponent<IProps> {
   myState = {
      user: new User(),
      termsAndCondition: false,
      confirmPassword: "",
      redirectToMain: false
   };
   constructor(props: IProps) {
      super(props);
      this.createNewCustomer = this.createNewCustomer.bind(this);
   }
   async createNewCustomer() {
      this.alert.List = [];
      if (!this.myState.termsAndCondition) {
         this.reRender(() => this.alert = new AlertObj(
            [new Error("0", "You must agree to terms and conditions")],
            AlertTypes.Error));
      }
      else if (this.myState.user?.tempPassword === "") {
         this.reRender(() => this.alert = new AlertObj(
            [new Error("0", "Password required")],
            AlertTypes.Error));
      }
      else if (this.myState.user.tempPassword !== this.myState.confirmPassword) {
         this.reRender(() => this.alert = new AlertObj(
            [new Error("0", "Passwords must match.")],
            AlertTypes.Error));
      }
      else {
         this.props.postUser(this.myState.user,
            (result: IUserAction) => {

               if (result.alert.List.length > 0) {
                  this.reRender(() => {
                     this.alert.List = result.alert.List;
                     this.alert.Type = AlertTypes.Error;
                     this.myState.redirectToMain = false;
                  });
               }
               else {
                  this.reRender(() => this.myState.redirectToMain = true);
               }
            }
         ).bind(this);
      }
   }
   validation(inputName: string = "") {
      return this.alert.List.find(t => t.key!.toLowerCase() == inputName.toLowerCase()) ?
         "danger" :
         "default";
   }
   render() {
      if (this.myState.redirectToMain) return <Redirect to="/" />;
      if (this.props.email != null) this.myState.user.email = this.props.email;
      return (
         <Modal className=""
            isOpen={this.props.isOpen}
            onClose={this.props.onCancel}>
            <Row className="p-3">
               <PageHeader className="col-12" title="New Customer" />

               <Input lblText="Name *" type="text" className="col-6  " keyVal="name"
                  error={this.alert.checkExist("Firstname")}
                  onChange={i => this.myState.user.firstName = i.target.value}
               />

               <Input lblText="Surname *" type="text" className="col-6" keyVal="surname"
                  error={this.alert.checkExist("surname")}
                  onChange={i => this.myState.user.surname = i.target.value}
               />
               <Input lblText="Phone Number" type="text" className="col-12" keyVal="phoneNumber"
                  error={this.alert.checkExist("phoneNumber")}
                  pattern={CommonRegex.UkNumber}
                  onChange={i => this.myState.user.phoneNumber = i.target.value}
               />


               <Input lblText="Email *" type="email" className="col-12" keyVal="email1"
                  error={this.alert.checkExist("email")}
                  bindedValue={this.myState.user.email}
                  pattern={CommonRegex.Email}
                  onChange={i => this.myState.user.email = i.target.value}
               />

               <Input lblText="Password *" type="password" className="col-6" keyVal="password"
                  error={this.alert.checkExist("passwordhash")}
                  onChange={i => this.myState.user.tempPassword = i.target.value}
               />

               <Input lblText="Confirm Password *" type="password" className="col-6" keyVal="confirmPassword"
                  error={this.alert.checkExist()}
                  onChange={i => this.myState.confirmPassword = i.target.value}
               />
               <div className="col-12">
                  <CheckBox keyVal="tAndc" className="mt-1"
                     required
                     onChange={() => this.reRender(() => this.myState.termsAndCondition = !this.myState.termsAndCondition)}
                     lblText={<div>I Agree to <a href="/termsandconditions" target="_blank">terms and conditions</a>.</div>} />
               </div>
               <div className="col-12 mt-2 modal-footer-hover">
                  <Alert alert={this.alert}
                     className="col-12 mb-1"
                     onClosed={() => this.reRender(() => this.alert.List = [])}
                  />
                  <Row className="modal-footer-hover">
                     <Button children="Submit" className="col-6 mt-2" btnclassName="btn-submit"
                        onClick={this.createNewCustomer} />
                     <Button children="Cancel" className="col-6 mt-2" btnclassName="btn-cancel"
                        onClick={() => this.reRender(() => { this.alert.List = []; this.props.onCancel(); })} />
                  </Row>
               </div>
            </Row>
         </Modal >
      );
   }

}

/// Redux Connection before exporting the component
export default connect(
   (state: IReduxStoreState) => { return {}; },
   dispatch => bindActionCreators({ postUser }, dispatch)
)(NewCustomer);

declare type IProps = {
   postUser: typeof postUser,
   isOpen: boolean,
   email: string,
   onCancel: () => void;
};