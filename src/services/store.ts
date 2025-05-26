import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './slices/menu-slice';
import purchaseReducer from './slices/purchase-slice';
import accountReducer from './slices/account-slice';
import catalogReducer from './slices/catalog-slice';
import basketReducer from './slices/basket-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = {
  menu: menuReducer,
  purchase: purchaseReducer, 
  account: accountReducer,
  catalog: catalogReducer,
  basket: basketReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;