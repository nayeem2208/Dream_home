import {configureStore} from '@reduxjs/toolkit'
import authSlice from './slices/userSlices/authSlice.js'
import { apiSlice } from './slices/userSlices/apiSlice.js'
import { adminApiSlice } from './slices/adminSlices/adminApiSlice.js'
import adminAuthSlice from './slices/adminSlices/adminAuthSlice.js'

const store=configureStore({
    reducer:{
        auth:authSlice,
        adminAuth:adminAuthSlice,
        [apiSlice.reducerPath]:apiSlice.reducer,
        // [adminApiSlice.reducerPath]:adminApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})

export default store