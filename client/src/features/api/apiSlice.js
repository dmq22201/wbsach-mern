import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredientials, setLogout } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://wbsach-api.vercel.app",
  //baseUrl: "http://127.0.0.1:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Ta fetch api dựa vào endpoint nào đó
  let result = await baseQuery(args, api, extraOptions);

  // Nếu api trả về status 403 ta fetch tới 1 endpoint  khác là refresh token để được cấp access token mới
  if (result?.error?.status === 403) {
    const refreshTokenResult = await baseQuery(
      "/api/v1/auth/refresh",
      api,
      extraOptions,
    );

    // Nếu api trả ra refresh token + access token mới ta sẽ có được dữ liệu mới. Sau đó ta dùng dữ liệu đó để tái-fetch dữ liệu bị status 403 trước đó. Bị lỗi status 403 trước đó thường là access token hết hạn
    if (refreshTokenResult?.data) {
      api.dispatch(setCredientials({ ...refreshTokenResult.data }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Nếu vẫn bị lỗi 403 cho user cút. Vì lúc này refresh token đã hết hạn không thể tái sử dụng để được cấp access token mới. Nên ta sẽ phải đăng nhập lại để có refresh + access token mới
      if (refreshTokenResult?.error?.status === 403) {
        const { dispatch } = api;

        dispatch(setLogout());
      }

      return refreshTokenResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Books", "CurrentUser", "Genres", "Authors", "Orders"],
  endpoints: () => ({}),
});
