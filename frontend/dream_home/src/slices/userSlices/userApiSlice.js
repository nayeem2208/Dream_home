import { apiSlice } from "./apiSlice";


const BACKEND_URL = "https://www.dreamhome.cloud";

export const UserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout:builder.mutation({
      query:()=>({
        url:`${BACKEND_URL}/logut`,
        method:'POST',
      })
    }),
    forgotpassword: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/forgot`,
        method: "POST",
        body: data,
      }),
    }),
    otpverify: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/verifyotp`,
        method: "POST",
        body: data,
      }),
    }),
    resetpassword: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/resetpassword`,
        method: "POST",
        body: data,
      }),
    }),
    googleauth: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/googleauth`,
        method: "POST",
        body: data,
      }),
    }),
    googleLoginbutton: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/googlelogin`,
        method: "POST",
        body: data,
      }),
    }),
    addPost:builder.mutation({
      query:(data)=>({
        url:`${BACKEND_URL}/uploadpost`,
        method:'PUT',
        body:data
      })
    })
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useForgotpasswordMutation,
  useOtpverifyMutation,
  useResetpasswordMutation,
  useGoogleauthMutation,
  useGoogleLoginbuttonMutation,
  useLogoutMutation,
  useAddPostMutation
} = UserApiSlice;
