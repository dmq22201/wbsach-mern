import { apiSlice } from "../api/apiSlice";
import { setCredientials, setUserInfo } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendLogin: builder.mutation({
      query: (account) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: account,
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
    }),
    sendRegister: builder.mutation({
      query: (account) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: account,
      }),
    }),
    getRefreshToken: builder.mutation({
      query: () => ({
        url: "/api/v1/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, user } = data;
          dispatch(setCredientials({ accessToken, user }));
        } catch (err) {
          // console.log(err);
        }
      },
      invalidatesTags: ["CurrentUser"],
    }),
    sendForgot: builder.mutation({
      query: (email) => ({
        url: "/api/v1/auth/forgot",
        method: "POST",
        body: email,
      }),
    }),
    sendResetPassword: builder.mutation({
      query: ({ passwordResetToken, password, passwordConfirm }) => ({
        url: `/api/v1/auth/reset-password/${passwordResetToken}`,
        method: "POST",
        body: {
          password,
          passwordConfirm,
        },
      }),
    }),
    getVerifyPasswordResetToken: builder.query({
      query: (passwordResetToken) =>
        `/api/v1/auth/reset-password/${passwordResetToken}`,
    }),
    sendUpdateInfo: builder.mutation({
      query: (newInfo) => ({
        url: `/api/v1/auth/profile/update-information`,
        method: "PATCH",
        body: newInfo,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    getProfile: builder.query({
      query: () => "/api/v1/auth/profile",
      async onQueryStarted(undefined, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(setUserInfo(res.data));
      },
      providesTags: ["CurrentUser"],
    }),
    sendUpdateSecurityPassword: builder.mutation({
      query: (newPassword) => ({
        url: "/api/v1/auth/profile/update-security-password",
        method: "PATCH",
        body: newPassword,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    sendUpdateSecurityEmail: builder.mutation({
      query: (newEmail) => ({
        url: "/api/v1/auth/profile/update-security-email",
        method: "PATCH",
        body: newEmail,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    sendConfirmDeleteAccount: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/profile/delete-account",
        method: "DELETE",
        body: data,
      }),
    }),
    sendUpdateAvatar: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/upload-avatar",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    getVerifyEmailToken: builder.query({
      query: (emailVerifyToken) =>
        `/api/v1/auth/verify-email/${emailVerifyToken}`,
    }),
    sendVerifyEmail: builder.mutation({
      query: (email) => ({
        url: "/api/v1/auth/send-email-verify",
        method: "POST",
        body: email,
      }),
    }),
    sendNewShippingAddress: builder.mutation({
      query: (shippingAddress) => ({
        url: "/api/v1/auth/profile/shipping-address",
        method: "POST",
        body: shippingAddress,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    sendDeleteShippingAddress: builder.mutation({
      query: (shippingAddress) => ({
        url: "/api/v1/auth/profile/shipping-address",
        method: "DELETE",
        body: shippingAddress,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    sendUpdateShippingAddress: builder.mutation({
      query: (shippingAddress) => ({
        url: "/api/v1/auth/profile/shipping-address",
        method: "PATCH",
        body: shippingAddress,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    sendUpdateFavoriteList: builder.mutation({
      query: (bookId) => ({
        url: "/api/v1/auth/profile/favorites",
        method: "PATCH",
        body: bookId,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    sendDeleteFavoriteList: builder.mutation({
      query: (bookId) => ({
        url: "/api/v1/auth/profile/favorites",
        method: "DELETE",
        body: bookId,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    sendSyncCart: builder.mutation({
      query: (cart) => ({
        url: "/api/v1/auth/profile/cart",
        method: "PATCH",
        body: cart,
      }),
      // invalidatesTags: ["CurrentUser"], // ! Bị lỗi Re-fetch liên tục giữa 2 endpoints: getProfile và sendSyncCart do invalidate cache
    }),
  }),
});

export const {
  useSendLoginMutation,
  useSendLogoutMutation,
  useSendRegisterMutation,
  useGetRefreshTokenMutation,
  useSendForgotMutation,
  useSendResetPasswordMutation,
  useGetVerifyPasswordResetTokenQuery,
  useSendUpdateInfoMutation,
  useGetProfileQuery,
  useSendUpdateSecurityPasswordMutation,
  useSendConfirmDeleteAccountMutation,
  useSendUpdateAvatarMutation,
  useSendUpdateSecurityEmailMutation,
  useGetVerifyEmailTokenQuery,
  useSendVerifyEmailMutation,
  useSendNewShippingAddressMutation,
  useSendDeleteShippingAddressMutation,
  useSendUpdateShippingAddressMutation,
  useSendUpdateFavoriteListMutation,
  useSendDeleteFavoriteListMutation,
  useSendSyncCartMutation,
} = authApiSlice;
