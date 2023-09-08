import { apiSlice } from "./apiSlice";

const USER_URL='/user'

export const UserApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        signup:builder.mutation({
            query:(data)=>({
                url:`${USER_URL}/signup`,
                method:'POST',
                body:data
            })
        }),
        login:builder.mutation({
            query:(data)=({
                url:`${USER_URL}/login`,
                method:'POST',
                body:data
            })
        })
    })
})

export const {useSignupMutation,useLoginMutation} =UserApiSlice