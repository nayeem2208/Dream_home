import {configureStore} from '@reduxjs/toolkit'
import authSlice from './slices/userSlices/authSlice.js'
import { apiSlice } from './slices/userSlices/apiSlice.js'

const store=configureStore({
    reducer:{
        auth:authSlice,
        [apiSlice.reducerPath]:apiSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})

export default store