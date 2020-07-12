import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSilentAuthentication, getLogout } from '../Actions/AuthenticationAction';
import { IReduxStoreState } from '../Reducers';

/// Protected Route functional is used
/// to decide the access to the routed component.
/// props values is received from the app.js component
class ProtectedRoute extends Component<IProps> {
   async componentWillReceiveProps() {
      const result = this.props.getSilentAuthentication(this.props.Authentication.isAuthenticated);
      if (result.accessClaimFailed) {
         this.props.getLogout();
      }
   }
   render() {
      // if the user is NOT authenticated then redirect them to the login page
      if (this.props.Authentication.isAuthenticated) {
         return (<Route path={this.props.path} render={this.props.Render} />);
      } else {
         /// Otherwise they authenticated thus route them to the intended page
         return (<Redirect to={{ pathname: "/Login", state: { fromPath: this.props.path } }} />);
      }
   }
};

/// Redux Connection before exporting the component
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
      getSilentAuthentication,
      getLogout,
   }, dispatch)
)(ProtectedRoute);

interface IProps {
   getSilentAuthentication: any,
   Authentication: any,
   getLogout: any,
   path: string,
   Render: any,
   exact?: boolean;
}
