import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
   Container, Row, PageHeader, Alert,
   SearchInput, Button, DropdownBtn,
   Pagination, Table, RF, thDataTable, trDataTable
} from 'twomj-components-react';
import { Role, PurifyComponent } from '../../CoreFiles/AppClass';
import AddModifyRoleModal from './AddModifyRoleModal';
import { getRoles, IRoleAction, IRoleList } from '../../Actions/RoleAction';
import {
   GetAllRecords,
   ConstMaxNumberOfPerItemsPage,
   AccessClaims
} from '../../CoreFiles/AppConst';
import { IReduxStoreState } from '../../Reducers';
import i18next from "i18next";
import { GetCurrentLang } from '../../CoreFiles/AppFunc';




class RoleManagement extends PurifyComponent<IProps> {
   myState: IState = {
      headerList: [],
      rowList: [],
      selectedRole: new Role(),
      filterAccessClaimValue: GetAllRecords,
      searchValue: '',
      isOpenRoleModal: false,
      listTotalCount: 0,
      selectedPage: 1,
      maxItemsPerPage: ConstMaxNumberOfPerItemsPage,
      isSortAsce: true,
      selectedSortName: "Name",
      lang: ''
   };
   constructor(props: IProps) {
      super(props);
      this.myState.lang = GetCurrentLang();
      this.editRole = this.editRole.bind(this);
      this.search = this.search.bind(this);
      this.sort = this.sort.bind(this);
      this.populate = this.populate.bind(this);
      this.accessClaimChanged = this.accessClaimChanged.bind(this);
      this.resetAllFilter = this.resetAllFilter.bind(this);
   }
   componentDidMount() {
      this.search();
   }
   componentDidUpdate() {
      if (GetCurrentLang() != this.myState.lang) {
         this.myState.lang = GetCurrentLang();
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
      await this.props.getRoles(
         this.myState.selectedPage,
         this.myState.maxItemsPerPage,
         searchVal,
         this.myState.filterAccessClaimValue,
         this.myState.isSortAsce,
         this.myState.selectedSortName,
         ((result: IRoleAction) => {
            if (result.alert.List.length > 0)
               this.reRender(() => this.alert = result.alert);
            else {
               this.reRender(() => {
                  // this.myState.roleList = (result.payload as IRoleList).list;
                  this.myState.listTotalCount = (result.payload as IRoleList).totalCount;
                  this.populate((result.payload as IRoleList).list);
               });

            }
         }).bind(this));
   }

   async editRole(role: Role) {
      this.reRender(() => {
         this.myState.selectedRole = role;
         this.myState.isOpenRoleModal = true;
      });
   }

   async sort(isSortAsce: boolean, sortName: string) {
      this.myState.isSortAsce = isSortAsce;
      this.myState.selectedSortName = sortName;
      await this.search();
   }

   populate(roleList: Role[]) {
      this.myState.headerList = [];
      this.myState.headerList.push(new thDataTable(i18next.t(`RoleManagement.RoleName`), "Name", true));
      this.myState.headerList.push(new thDataTable(i18next.t(`RoleManagement.AccessClaim`), "AccessClaim", true));
      this.myState.headerList.push(new thDataTable("", "", false));

      this.myState.rowList = [];
      roleList.map(role =>
         this.myState.rowList.push(new trDataTable([
            <RF data={role.name} />,
            <RF data={i18next.t(`RoleManagement.${role.accessClaim}`)} />,
            <div className="col-auto p-0 m-0">
               <Button keyVal={role.id.toString()} btnclassName=" btn-edit xs col-12 m-0 mt-1 mt-xl-0"
                  onClick={() => this.editRole(role)}
                  children={i18next.t('Button.Edit')} />
            </div>
         ])));
   }

   async accessClaimChanged(accessClaim: string) {

      this.myState.filterAccessClaimValue = accessClaim;
      await this.search();
   }

   resetAllFilter() {
      this.myState.filterAccessClaimValue = GetAllRecords;
   }

   render() {
      let accessClaimList: any[] = [];
      AccessClaims.List.map(t => accessClaimList.push({ id: t.id, value: t.name, name: i18next.t(`RoleManagement.${t.name}`) }));
      return (
         <div className="w-100">
            <PageHeader className="c-float-left" title={i18next.t('RoleManagement.RoleManagement')} />
            {/***** Controls  ****/}
            <Row className="col-12 p-0 m-0 mb-2 c-float-left">
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
                     <a children={i18next.t('RoleManagement.Role')} />
                  </RF>}
                  className="col-12 col-md-2 m-0 p-0 c-pl-1  mt-1"
                  btnclassName="btn-submit "
                  onClick={() => this.reRender(() => {
                     this.myState.selectedRole = new Role();
                     this.myState.isOpenRoleModal = true;
                  })}
               />
               {/***** Filter Drop-downs ****/}
               <DropdownBtn keyVal="ddbAccessClaim"
                  className="col-12  col-md-4 m-0 p-0 pl-1 mt-1"
                  spanClassName="text-center dropdown-menu-right"
                  onChange={(value: string) => this.accessClaimChanged(value)}
                  defaultValue={GetAllRecords}
                  defaultDisplayPrefix={i18next.t('RoleManagement.AccessClaimType')}
                  defaultDisplay={i18next.t('Common.All')}
                  list={accessClaimList}
                  selectedValue={this.myState.filterAccessClaimValue != GetAllRecords ?
                     i18next.t(`RoleManagement.${this.myState.filterAccessClaimValue}`).toString() :
                     this.myState.filterAccessClaimValue}
               />
            </Row>
            {/***** Role Table  ****/}
            <Row className="col-12 p-0 m-0">
               <Table className="col-12 text-center" responsive hover
                  headerList={this.myState.headerList}
                  rowList={this.myState.rowList}
                  DefualtSortName={this.myState.selectedSortName}
                  onThClickAsync={async (isAsec, sortName) => await this.sort(isAsec, sortName)}
               />
               <Pagination setListOnLoad={false}
                  setList={async (sp, mi) => await this.search(sp, mi)}
                  listCount={this.myState.listTotalCount}
                  totalText={i18next.t('Common.TotalPageText')} />
            </Row>
            {this.myState.isOpenRoleModal &&
               <AddModifyRoleModal isOpen={this.myState.isOpenRoleModal}
                  role={this.myState.selectedRole}
                  accessClaimList={accessClaimList}
                  onActionCompleted={async () => await this.search()}
                  onClose={() => this.reRender(() => {
                     this.myState.isOpenRoleModal = false;
                     this.myState.selectedRole = new Role();
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
   dispatch => bindActionCreators({ getRoles }, dispatch)
)(RoleManagement);

declare type IProps = {
   getRoles: typeof getRoles;
   refresh: boolean;
};
declare type IState = {
   headerList: thDataTable[],
   rowList: trDataTable[],
   selectedRole: Role,
   filterAccessClaimValue: string,
   searchValue: string,
   isOpenRoleModal: boolean,
   listTotalCount: number,
   selectedPage: number,
   maxItemsPerPage: number,
   isSortAsce: boolean,
   selectedSortName: string,
   lang: string;
};
