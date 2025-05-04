import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3001/api`,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  endpoints(builder) {
    return {
      userSignup: builder.mutation({
        query: (userInfo) => {
          return {
            method: "POST",
            url: "/users/signup",
            body: userInfo,
          };
        },
      }),
      userLogin: builder.mutation({
        query: (userInfo) => {
          return {
            method: "POST",
            url: "/users/login",
            body: userInfo,
          };
        },
      }),
      userLogout: builder.mutation({
        query: () => {
          return {
            method: "GET",
            url: `/users/logout`,
          };
        },
      }),
    };
  },
});

export const {
  useUserSignupMutation,
  useUserLoginMutation,
  useUserLogoutMutation,
} = userApi;
export { userApi };
