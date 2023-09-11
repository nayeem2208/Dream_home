import { apiSlice } from "./apiSlice";

const USER_URL='/'
const BACKEND_URL = 'http://localhost:3000';

export const UserApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        signup:builder.mutation({
            query:(data)=>({
                url:`${BACKEND_URL}/signup`,
                method:'POST',
                body:data
            }),
        }),
        login:builder.mutation({
            query:(data)=>({
                url:`${BACKEND_URL}/login`,
                method:'POST',
                body:data
            }),
        }),
        
    })
})

export const {useSignupMutation,useLoginMutation} =UserApiSlice