import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("blogUserInfo")
    ? JSON.parse(localStorage.getItem("blogUserInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer function for saving user data in redux store and localstorage
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("blogUserInfo", JSON.stringify(action.payload));
    },
    // Reducer function for deleting user data from redux store and localstorage
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("blogUserInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
