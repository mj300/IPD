import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
   Row, Modal, PageHeader,
   Alert, Button, ButtonPopupConfirm,
   Input, RF, DropdownBtn, DropdownInput
} from 'twomj-components-react';
import { AlertTypes, CommonRegex } from '../../CoreFiles/AppConst';
import { User, PurifyComponent, AlertObj, Role } from '../../CoreFiles/AppClass';
import { putUser, postUser, deleteUser, IUserAction } from '../../Actions/UserAction';
import { Error } from '../../CoreFiles/AppClass';
import { IReduxStoreState } from '../../Reducers';
import i18next from "i18next";




class AddModifyUserModal extends PurifyComponent<IProps> {
   myState: IMyState = {
      user: new User(),
      showPassword: false
   };
   constructor(props: IProps) {
      super(props);
      this.myState.user = this.props.User;
      this.checkApiCallResult = this.checkApiCallResult.bind(this);
      this.submitUser = this.submitUser.bind(this);
      this.deleteUser = this.deleteUser.bind(this);
   }


   async deleteUser() {
      await this.props.deleteUser(this.myState.user,
         await this.checkApiCallResult);
      await this.props.onActionCompleted();
   }

   async submitUser() {
      console.log(this.myState.user);
      if (this.myState.user.id > 0) {
         await this.props.putUser(this.myState.user,
            await this.checkApiCallResult,
            [i18next.t('UserManagement.UserUpdated')]
         );
      } else if (this.myState.user.id === 0) {
         await this.props.postUser(this.myState.user,
            await this.checkApiCallResult,
            [i18next.t('UserManagement.NewUserCreated')]
         );
      }
      await this.props.onActionCompleted();
   }

   async checkApiCallResult(result: IUserAction, successMessage: string) {
      if (result.alert.List.length > 0) {
         if (result.alert.Type == AlertTypes.Success) {
            this.reRender(() => {
               this.alert = result.alert;
               this.myState.user = new User();
            });
         }
         else {
            this.reRender(() => this.alert = result.alert);
         }
      }
      else
         this.reRender(() => {
            this.myState.user = result.payload as User;
            this.alert = new AlertObj([new Error("s", successMessage)], AlertTypes.Success);
         });
   }


   render() {
      if (!this.props.isOpen) {
         this.alert.List = [];
         this.myState.user = new User();
      }
      let isNewUser = true;
      if (this.myState.user.id > 0)
         isNewUser = false;
      return (
         <Modal isOpen={this.props.isOpen} onClose={this.props.onClose} >
            <Row className="p-3 modal-scroll-y">
               <PageHeader title={isNewUser ? i18next.t('UserManagement.NewUser') : i18next.t('UserManagement.UpdateUser')} />
               {!isNewUser && <div className="col-2 pl-2" >
                  <Button children={<RF><i className="fas fa-plus" /></RF>}
                     btnclassName="btn-submit"
                     onClick={() => this.reRender(() => { this.myState.user = new User(); this.alert.List = []; })}
                  /></div>}
               <Row className="col-12">
                  <Input lblText={i18next.t('UserManagement.UserName')} type="text" keyVal="txtUserName"
                     error={this.alert.checkExist("userName")}
                     errorText={this.alert.getError("userName")}
                     bindedValue={this.myState.user.userName}
                     onChange={i => this.myState.user.userName = i.target.value}
                     className="col-12" />
               </Row>
               {/***** Name & Surname ****/}
               <Row className="col-12">
                  <Input lblText={i18next.t('UserManagement.FirstName')} type="text" keyVal="txtName"
                     error={this.alert.checkExist("FirstName")}
                     errorText={this.alert.getError("FirstName")}
                     bindedValue={this.myState.user.firstName}
                     onChange={i => this.myState.user.firstName = i.target.value}
                     className="col-12 col-md-6 " />
                  <Input lblText={i18next.t('UserManagement.Surname')} type="text" keyVal="txtSurname"
                     error={this.alert.checkExist("surname")}
                     errorText={this.alert.getError("surname")}
                     bindedValue={this.myState.user.surname}
                     onChange={i => this.myState.user.surname = i.target.value}
                     className="col-12 col-md-6" />
               </Row>
               {/***** phone Number and role ****/}
               <Row className="col-12">
                  <DropdownInput keyVal="ddbAccessClaim1"
                     list={this.props.roles}
                     error={this.alert.checkExist("Role")}
                     errorText={this.alert.getError("Role")}
                     className="col-12 col-md-6" lblText={i18next.t(`RoleManagement.Role`)}
                     prefix={i18next.t(`Common.Choose`)}
                     onChange={(value: any) => { this.myState.user.role = value; }}
                     selectedValue={this.myState.user.role.name} />
                  <Input lblText={i18next.t(`UserManagement.PhoneNumber`)} type="text" keyVal="txtPhone"
                     error={this.alert.checkExist("phoneNumber")}
                     errorText={this.alert.getError("phoneNumber")}
                     pattern={CommonRegex.PhoneNumber_IR}
                     bindedValue={this.myState.user.phoneNumber}
                     onChange={i => this.myState.user.phoneNumber = i.target.value}
                     className="col-12 col-md-6" />
               </Row>
               {/***** Email ****/}
               <Row className="col-12">
                  <Input lblText={i18next.t('UserManagement.Email')} type="email" keyVal="txtEmail"
                     error={this.alert.checkExist("email")}
                     errorText={this.alert.getError("email")}
                     pattern={CommonRegex.Email}
                     bindedValue={this.myState.user.email}
                     onChange={i => this.myState.user.email = i.target.value}
                     className="col-12 " />

               </Row>
               {/***** Password and confirm password ****/}
               {isNewUser &&
                  <Row className="col-12 p-0 m-0 mt-2">
                     <label className="col-12 p-0 c-float-left"
                        children={i18next.t('UserManagement.Password')} />
                     <Input keyVal="txtPassword"
                     error={this.alert.checkExist("PasswordHash")}
                     errorText={this.alert.getError("PasswordHash")}
                        bindedValue={this.myState.user.tempPassword}
                        lblDisabled
                        onChange={i => this.myState.user.tempPassword = i.target.value}
                        className="col-10 m-0 p-0 pr-2"
                        type={this.myState.showPassword ? "text" : "password"}
                     />
                     <Button children={this.myState.showPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                        className="col-2 pr-2  "
                        btnclassName="btn-submit"
                        onClick={() => this.reRender(() => this.myState.showPassword = !this.myState.showPassword)} />
                  </Row>
               }
            </Row>
               <Alert alert={this.alert}
                  excludeKey={["userName", "FirstName", "surname", "Role", "phoneNumber", "email", "PasswordHash"]}
                  className="col-12"
                  onClosed={() => this.reRender(() => this.alert.List = [])} />
               {/***** buttons ****/}
               <Row className="col-12 modal-footer-hover">
                  {!isNewUser &&
                     <Row className="col-12 col-sm-8 p-0 m-0 ">
                     <ButtonPopupConfirm children={i18next.t('Button.Update')}  key="btnUpdate"
                        popupMessage={i18next.t('Message.AreYouSure')}
                           className="col-12  col-md-6 mt-1"
                           btnClassName="btn-submit"
                        btnNoClassName="btn-cancel xs"
                        btnYesClassName="btn-submit xs"
                        btnYesText={i18next.t('Common.Yes')}
                        btnNoText={i18next.t('Common.No')}
                           onConfirmClick={async () => await this.submitUser()}
                        />
                     <ButtonPopupConfirm children={i18next.t('Button.Delete')} key="btnDelete"
                        popupMessage={i18next.t('Message.AreYouSure')}
                           className="col-12 col-md-6 pl-1 mt-1"
                           btnClassName="btn-delete"
                        btnNoClassName="btn-cancel xs"
                        btnYesClassName="btn-submit xs"
                        btnYesText={i18next.t('Common.Yes')}
                        btnNoText={i18next.t('Common.No')}
                           onConfirmClick={async () => await this.deleteUser()}
                        />
                     </Row>
                  }
                  {isNewUser &&
                     <Button children={i18next.t('Button.Create')}
                        className="col-12 col-sm-6 pl-1 mt-1"
                        btnclassName="btn-submit"
                        onClick={async () => await this.submitUser()} />
                  }
                  <Button children={i18next.t('Button.Cancel')}
                     className={`col-12  ${isNewUser ? "col-sm-6 " : "col-sm-4"} p-0 m-0 pl-1 mt-1`}
                     btnclassName="btn-cancel"
                     onClick={this.props.onClose} />
               </Row>
            
         </Modal>
      );
   }
}

/// Redux Connection before exporting the component
export default connect(
   (myState: IReduxStoreState) => {
      return {};
   },
   dispatch => bindActionCreators({
      putUser,
      postUser,
      deleteUser
   }, dispatch)
)(AddModifyUserModal);

declare type IMyState = {
   user: User,
   showPassword: boolean,
};

declare type IProps = {
   isOpen: boolean;
   User: User;
   roles: Role[];
   postUser: typeof postUser;
   putUser: typeof putUser;
   deleteUser: typeof deleteUser;
   onClose: () => void;
   onActionCompleted: () => void;
};