import { combineReducers } from 'redux';
import { createStore, applyMiddleware, Store } from "redux";
// Used to add developer tool functionalities for debugging
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from "redux-thunk";
import AuthenticationReducer, { IAuthenticationReducer } from './AuthenticationReducer';

export declare type IReduxStoreState = {
   Authentication: IAuthenticationReducer,
   Language: string,
};

const AllReducers = combineReducers(
   {
      Authentication: AuthenticationReducer
   });

const persistConfig = {
   key: 'root',
   storage,
};

const persistedReducer = persistReducer(persistConfig, AllReducers);

export default () => {
   const store: Store = createStore(
      persistedReducer,
      composeWithDevTools(applyMiddleware(thunk))
   );
   let persistor: Persistor = persistStore(store);
   return { store, persistor };
};