import { apiSlice } from "./apiSlice";

const USER_URL='/user'

export const UserApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        Signup:builder.mutation({
            query:(data)=>({
                url:`${USER_URL}/signup`,
                method:'POST',
                body:data
            }),
        }),
        Login:builder.mutation({
            query:(data)=>({
                url:`${USER_URL}/login`,
                method:'POST',
                body:data
            }),
        }),
        
    })
})

export const {useSignupMutation,useLoginMutation} =UserApiSlice