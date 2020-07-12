import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
   Row, PageHeader, Alert,
   SearchInput, Button, DropdownBtn,
   Pagination, Table, RF, thDataTable, trDataTable
} from 'twomj-components-react';
import { User, PurifyComponent, Role } from '../../CoreFiles/AppClass';
import AddModifyUserModal from './AddModifyUserModal';
import { getUsers, IUserAction, IUserList } from '../../Actions/UserAction';
import { getAllRoles, IRoleList, IRoleAction } from '../../Actions/RoleAction';
import {
   GetAllRecords,
   ConstMaxNumberOfPerItemsPage,
   AccessClaims
} from '../../CoreFiles/AppConst';
import { IReduxStoreState } from '../../Reducers';
import i18next from 'i18next';
import { GetCurrentLang } from '../../CoreFiles/AppFunc';




class UserManagement extends PurifyComponent<IProps> {
   myState: IMyState = {
      roleList: [],
      headerList: [],
      rowList: [],
      selectedUser: new User(),
      roleValue: GetAllRecords,
      searchValue: '',
      isOpenUserModal: false,
      listTotalCount: 0,
      selectedPage: 1,
      maxItemsPerPage: ConstMaxNumberOfPerItemsPage,
      isSortAsce: true,
      selectedSortName: "Name",
      lang: ''
   };
   constructor(props: IProps) {
      super(props);
      this.editUser = this.editUser.bind(this);
      this.search = this.search.bind(this);
      this.sort = this.sort.bind(this);
      this.populate = this.populate.bind(this);
      this.roleChanged = this.roleChanged.bind(this);
      this.resetAllFilter = this.resetAllFilter.bind(this);

   }

   componentDidUpdate() {
      if (GetCurrentLang() != this.myState.lang) {
         this.myState.lang = GetCurrentLang();
         this.props.getAllRoles(((result: IRoleAction) => {
            this.myState.roleList = (result.payload as IRoleList).list;
         }).bind(this));
         this.search();
      }
   }

   async search(selectedPage?: number, maxItemsPerPage?: number) {
      if (!(selectedPage == null))
         this.myState.selectedPage = selectedPage;
      if (!(maxItemsPerPage == null))
         this.myState.maxItemsPerPage = maxItemsPerPage;
      let searchVal = GetAllRecords;
      if (this.myState.searchValue != null && this.myState.searchValue != '')
         searchVal = this.myState.searchValue;


      await this.props.getUsers(
         this.myState.selectedPage,
         this.myState.maxItemsPerPage,
         searchVal,
         this.myState.roleValue,
         this.myState.isSortAsce,
         this.myState.selectedSortName,
         ((result: IUserAction) => {
            if (result.alert.List.length > 0)
               this.reRender(() => this.alert = result.alert);
            else {
               this.reRender(() => {
                  this.myState.listTotalCount = (result.payload as IUserList).totalCount;
                  this.populate((result.payload as IUserList).list);
               });

            }
         }).bind(this));
   }

   async editUser(User: User) {
      this.reRender(() => {
         this.myState.selectedUser = User;
         this.myState.isOpenUserModal = true;
      });
   }

   async sort(isSortAsce: boolean, sortName: string) {
      this.myState.isSortAsce = isSortAsce;
      this.myState.selectedSortName = sortName;
      await this.search();
   }

   populate(userList: User[]) {
      this.myState.headerList = [];
      this.myState.headerList.push(new thDataTable(i18next.t(`UserManagement.UserName`), "UserName", true));
      this.myState.headerList.push(new thDataTable(i18next.t(`UserManagement.FirstName`), "FirstName", true));
      this.myState.headerList.push(new thDataTable(i18next.t(`UserManagement.Surname`), "Surname", true));
      this.myState.headerList.push(new thDataTable(i18next.t(`RoleManagement.Role`), "Role.Name", true));
      this.myState.headerList.push(new thDataTable(i18next.t(`UserManagement.Email`), "Email", true));
      this.myState.headerList.push(new thDataTable(i18next.t(`UserManagement.PhoneNumber`), "PhoneNumber", true));
      this.myState.headerList.push(new thDataTable("", "", false));

      this.myState.rowList = [];
      userList?.length > 0 && userList.map(user =>
         this.myState.rowList.push(new trDataTable([
            <RF data={user.userName} />,
            <RF data={user.firstName} />,
            <RF data={user.surname} />,
            <RF data={user.role.name} />,
            <RF data={user.email} />,
            <RF data={user.phoneNumber} />,
            <button className=" btn-edit xs col-12 m-0 mt-1 mt-xl-0"
               onClick={() => this.editUser(user)}
               children={i18next.t('Button.Edit')} />
         ])));
   }

   async roleChanged(roleName: string) {

      this.myState.roleValue = this.myState.roleList.find(r => r.name == roleName)?.id.toString() || GetAllRecords;
      await this.search();
   }

   resetAllFilter() {
      this.myState.roleValue = GetAllRecords;
   }

   render() {
      return (
         <div className="w-100">
            <PageHeader className="c-float-left" title={i18next.t('UserManagement.UserManagement')} />
            {/***** Controls  ****/}
            <Row className="col-12 p-0 m-0 mb-2 rtlSupport">
               <Alert alert={this.alert}
                  className="col-12 mb-2"
                  onClosed={() => this.reRender(() => this.alert.List = [])}
               />
               {/***** Search Input  ****/}
               <SearchInput keyVal="searchInput"
                  showIconButton
                  btnClassName="btn-search"
                  bindedValue={this.myState.searchValue}
                  onChange={i => this.myState.searchValue = i.target.value}
                  className="col-12 col-md-6 m-0 p-0 mt-1"
                  placeholder={i18next.t('Common.Search')}
                  onSearch={() => this.search(this.myState.selectedPage, this.myState.maxItemsPerPage)}
                  onResetSearch={() => {
                     this.resetAllFilter();
                     this.search(this.myState.selectedPage, this.myState.maxItemsPerPage);
                  }}
               />
               <Button keyVal="btnAdd"
                  children={<RF>
                     <i className="fas fa-plus c-pl-1" />
                     <a children={i18next.t('UserManagement.User')} />
                  </RF>}
                  className="col-12 col-md-2 m-0 p-0 c-pl-1  mt-1"
                  btnclassName="btn-submit"
                  onClick={() => this.reRender(() => {
                     this.myState.selectedUser = new User();
                     this.myState.isOpenUserModal = true;
                  })}
               />
               {/***** Filter Drop-downs ****/}
               <DropdownBtn keyVal="ddbRole"
                  className="col-12  col-md-4 m-0 p-0 pl-1 mt-1"
                  spanClassName="text-center dropdown-menu-right"
                  onChange={(value: string) => this.roleChanged(value)}
                  defaultValue={GetAllRecords}
                  defaultDisplayPrefix={i18next.t('RoleManagement.Role')}
                  defaultDisplay={i18next.t('Common.All')}
                  list={this.myState.roleList}
                  selectedValue={this.myState.roleValue}
               />
            </Row>
            {/***** User Table  ****/}
            <Row className="col-12 p-0 m-0">
               <Table className="col-12 text-center" responsive hover
                  headerList={this.myState.headerList}
                  rowList={this.myState.rowList}
                  DefualtSortName={this.myState.selectedSortName}
                  onThClickAsync={async (isAsec, sortName) => await this.sort(isAsec, sortName)}
               />
               <Pagination setListOnLoad={true}
                  setList={async (sp, mi) => await this.search(sp, mi)}
                  listCount={this.myState.listTotalCount}
                  totalText={i18next.t('Common.TotalPageText')} />
            </Row>
            {this.myState.isOpenUserModal &&
               <AddModifyUserModal isOpen={this.myState.isOpenUserModal}
                  roles={this.myState.roleList}
                  User={this.myState.selectedUser}
                  onActionCompleted={async () => await this.search()}
                  onClose={() => this.reRender(() => {
                     this.myState.isOpenUserModal = false;
                     this.myState.selectedUser = new User();
                  })}
               />
            }
         </div>
      );
   }
}

/// Redux Connection before exporting the component
export default connect(
   (state: IReduxStoreState) => {
      return {};
   },
   dispatch => bindActionCreators({ getUsers, getAllRoles }, dispatch)
)(UserManagement);

declare type IProps = {
   getUsers: typeof getUsers;
   getAllRoles: typeof getAllRoles;
   refresh: boolean;
};
declare type IMyState = {
   roleList: Role[],
   headerList: thDataTable[],
   rowList: trDataTable[],
   selectedUser: User,
   roleValue: string,
   searchValue: string,
   isOpenUserModal: boolean,
   listTotalCount: number,
   selectedPage: number,
   maxItemsPerPage: number,
   isSortAsce: boolean,
   selectedSortName: string,
   lang: string,
};
