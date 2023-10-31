import { adminApiSlice } from "./adminApiSlice";


const BACKEND_URL = "https://www.dreamhome.fun/admin";

export const AdminApiSlice = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${BACKEND_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout:builder.mutation({
      query:()=>({
        url:`${BACKEND_URL}/logout`,
        method:'POST',
      })
    }),
    
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation
} = AdminApiSlice;
