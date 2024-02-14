import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredientials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.token = accessToken;
      state.user = user;
    },
    setUserInfo: (state, action) => {
      const { user } = action.payload;
      state.user = {
        ...user,
      };
    },
    setLogout: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
});

//export const selectCurrentUser = (state) => state.auth.user;
const selectUser = (state) => state.auth.user;
export const selectCurrentUser = createSelector([selectUser], (user) => user);

export const selectCurrentToken = (state) => state.auth.token;

export const { setCredientials, setUserInfo, setLogout } = authSlice.actions;

export default authSlice.reducer;
