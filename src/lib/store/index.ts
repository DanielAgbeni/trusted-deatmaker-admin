import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './features/auth/authApi';
import { configApi } from './features/config/configApi';
import { vendorDashboardApi } from './features/vendorDashboardApi/vendorDashboardApi';
import { userDashboardApi } from './features/userDashboardApi/userDashboardApi';
import { generalApis } from './features/generalApis/generalApis';
import { adminDashboardApi } from './features/adminDashboardApi/adminDashboardApi';


export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [configApi.reducerPath]: configApi.reducer,
      [vendorDashboardApi.reducerPath]: vendorDashboardApi.reducer, // Add this
      [userDashboardApi.reducerPath]: userDashboardApi.reducer,
      [generalApis.reducerPath]: generalApis.reducer,
      [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        configApi.middleware,
        vendorDashboardApi.middleware,
        userDashboardApi.middleware,
        generalApis.middleware,
        adminDashboardApi.middleware
      ),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];