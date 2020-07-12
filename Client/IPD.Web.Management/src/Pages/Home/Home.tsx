import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PurifyComponent } from '../../CoreFiles/AppClass';
import { IReduxStoreState } from '../../Reducers';
import i18next from "i18next";

class Home extends PurifyComponent<IProps> {
   myState = {
   };
   constructor(props: IProps) {
      super(props);
   }
   render() {
      return (
         <div className="container custom-container bg-transparent">
            <div>
               <div className="text-center pb-5 pt-3 mt-3 mb-2  ">
                  <h1 className="welcome-title">{i18next.t('NavMenu.Home')}</h1>
                  <h3 className="welcome-text pl-3 pr-3">We are full stack developers and we are ready to make your next website dream into reality.</h3>
                  <Link to="/ContactUs" className='btn btn-welcome'>Contact Us</Link>
               </div>
            </div>
         </div >
      );
   }
}
declare type IProps = {

};
export default connect(
   (state: IReduxStoreState) => {
      return {

      };
   },
   dispatch => bindActionCreators({}, dispatch)
)(Home);
