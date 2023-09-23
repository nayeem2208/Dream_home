import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers, { getState }) => {
    const { userInfo } = getState().auth;

    // Check if the user is authenticated and has credentials
    if (userInfo && userInfo.credentials) {
      // Assuming you have a field like 'credentials' in your user info that holds tokens or cookies
      headers.set("Authorization", `Bearer ${userInfo.credentials}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
