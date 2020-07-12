import 'twomj-core-ts/src/Type.Extentions';
import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from './Reducers/index';
import { I18nextProvider } from 'react-i18next';
import App from "./App";

import i18n from "./CoreFiles/i18n/i18n";



const { persistor, store } = configureStore();

render(
   <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         <BrowserRouter>
            <I18nextProvider i18n={i18n}>
               <App />
            </I18nextProvider>
         </BrowserRouter>
      </PersistGate>
   </Provider>,
   document.getElementById("rootDiv")
);