import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
   Row, Modal, PageHeader,
   Alert, Button, ButtonPopupConfirm,
   Input, DropdownInput, RF, DropdownBtn
} from 'twomj-components-react';
import { AlertTypes } from '../../CoreFiles/AppConst';
import { Role, PurifyComponent, AlertObj } from '../../CoreFiles/AppClass';
import { putRole, postRole, deleteRole, IRoleAction } from '../../Actions/RoleAction';
import { Error } from '../../CoreFiles/AppClass';
import { IReduxStoreState } from '../../Reducers';
import i18next from "i18next";

class AddModifyRoleModal extends PurifyComponent<IProps> {
   myState = {
      role: new Role(),
   };
   constructor(props: IProps) {
      super(props);
      this.myState.role = this.props.role;
      this.checkApiCallResult = this.checkApiCallResult.bind(this);
      this.submitRole = this.submitRole.bind(this);
      this.deleteRole = this.deleteRole.bind(this);
   }


   async deleteRole() {
      await this.props.deleteRole(this.myState.role,
         await this.checkApiCallResult);
      await this.props.onActionCompleted();
   }

   async submitRole() {
      if (this.myState.role.id > 0) {
         await this.props.putRole(this.myState.role,
            await this.checkApiCallResult,
            [i18next.t('RoleManagement.RoleUpdated')]
         );
      } else if (this.myState.role.id === 0) {
         await this.props.postRole(this.myState.role,
            await this.checkApiCallResult,
            [i18next.t('RoleManagement.NewRoleCreated')]
         );
      }
      await this.props.onActionCompleted();
   }

   async checkApiCallResult(result: IRoleAction, successMessage: string) {
      if (result.alert.List.length > 0) {
         if (result.alert.Type == AlertTypes.Success) {
            this.reRender(() => {
               this.alert = result.alert;
               this.myState.role = new Role();
            });
         }
         else {
            this.reRender(() => this.alert = result.alert);
         }
      }
      else
         this.reRender(() => {
            this.myState.role = result.payload as Role;
            this.alert = new AlertObj([new Error("s", successMessage)], AlertTypes.Success);
         });
   }


   render() {
      if (!this.props.isOpen) {
         this.alert.List = [];
         this.myState.role = new Role();
      }
      let isNewRole = true;
      if (this.myState.role.id > 0)
         isNewRole = false;
      return (
         <Modal isOpen={this.props.isOpen} onClose={this.props.onClose} >
            <Row className="p-3 modal-scroll-y">
               <PageHeader title={isNewRole ? i18next.t('RoleManagement.NewRole') : i18next.t('RoleManagement.UpdateRole')} />
               {!isNewRole && <div className="col-2 pl-2" >
                  <Button children={<RF><i className="fas fa-plus" /></RF>}
                     btnclassName="btn-submit"
                     onClick={() => this.reRender(() => { this.myState.role = new Role(); this.alert.List = []; })}
                  /></div>}

               <DropdownInput list={this.props.accessClaimList}
                  className="col-12" keyVal="ddbAccessClaim" lblText={i18next.t(`RoleManagement.AccessClaim`)}
                  onChange={select => { this.myState.role.accessClaim = select.value; }}
                  selectedValue={this.myState.role.accessClaim}
                  error={this.alert.checkExist("accessClaim")}
                  errorText={this.alert.getError("accessClaim")}
                  prefix={i18next.t(`Common.Choose`)} />
               <Input lblText={i18next.t(`RoleManagement.RoleName`)}
                  key={this.myState.role.id || "NewRole"}
                  bindedValue={this.myState.role.name}
                  error={this.alert.checkExist("Name")}
                  errorText={this.alert.getError("Name")}
                  onChange={i => this.myState.role.name = i.target.value}
                  className="col-12" />
            </Row>

            <Alert alert={this.alert}
               className="col-12"
               excludeKey={["Name", "accessClaim"]}
               onClosed={() => this.reRender(() => this.alert.List = [])}
            />
            {/***** buttons ****/}
            <Row className="col-12 modal-footer-hover">
               {!isNewRole &&
                  <Row className="col-12 col-sm-8 p-0 m-0 ">
                     <ButtonPopupConfirm children={i18next.t('Button.Update')} key="btnUpdate"
                        popupMessage={i18next.t('Message.AreYouSure')}
                        className="col-12  col-md-6 mt-1"
                        btnClassName="btn-submit"
                        btnNoClassName="btn-cancel xs"
                        btnYesClassName="btn-submit xs"
                        btnYesText={i18next.t('Common.Yes')}
                        btnNoText={i18next.t('Common.No')}
                        onConfirmClick={async () => await this.submitRole()}
                     />
                     <ButtonPopupConfirm children={i18next.t('Button.Delete')} key="btnDelete"
                        popupMessage={i18next.t('Message.AreYouSure')}
                        className="col-12 col-md-6 pl-1 mt-1"
                        btnClassName="btn-delete"
                        btnNoClassName="btn-cancel xs"
                        btnYesClassName="btn-submit xs"
                        btnYesText={i18next.t('Common.Yes')}
                        btnNoText={i18next.t('Common.No')}
                        onConfirmClick={async () => await this.deleteRole()}
                     />
                  </Row>
               }
               {isNewRole &&
                  <Button children={i18next.t('Button.Create')}
                     className="col-12 col-sm-6 pl-1 mt-1"
                     btnclassName="btn-submit"
                     onClick={async () => await this.submitRole()} />
               }
               <Button children={i18next.t('Button.Cancel')}
                  className={`col-12  ${isNewRole ? "col-sm-6 " : "col-sm-4"} p-0 m-0 pl-1 mt-1`}
                  btnclassName="btn-cancel"
                  onClick={this.props.onClose} />
            </Row>
         </Modal>
      );
   }
}

/// Redux Connection before exporting the component
export default connect(
   (state: IReduxStoreState) => {
      return {};
   },
   dispatch => bindActionCreators({
      putRole,
      postRole,
      deleteRole,
   }, dispatch)
)(AddModifyRoleModal);

declare type IProps = {
   isOpen: boolean;
   role: Role;
   accessClaimList: any[];
   postRole: typeof postRole;
   putRole: typeof putRole;
   deleteRole: typeof deleteRole;
   onClose: () => void;
   onActionCompleted: () => void;
};