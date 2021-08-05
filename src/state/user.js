import axios from "axios";

import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";

import { Platform } from "react-native";
/* import AsyncStorage from "@react-native-async-storage/async-storage"; */
import { AsyncStorage } from "react-native";

const initialState = {
  userRegister: {},
  userLogin: {},
  me: {},
  savedPlans: [],
};

const ip = "192.168.200.22";
const os = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const createUser = createAsyncThunk("CREATE_USER", (user) => {
  console.log("esta llegando el user", user);
  return axios
    .post(`http://192.168.0.3:3001/api/user/register`, user)
    .then((res) => res.data)
    .catch((error) =>
      //en el caso de usuario ya creado, llega el error 409. Como hacer que esto llegue al front?
      console.log("ACA ESTA EL ERROR EN CREATE_USER -----> ", error)
    );
});

export const loginUser = createAsyncThunk("LOGIN_USER", (user) => {
  console.log("esta llegando el loginUser", user);
  return axios
    .post(`http://192.168.0.3:3001/api/user/login`, user)
    .then((res) => {
      AsyncStorage.setItem("token", JSON.stringify(res.data.token));
      return res.data.token;
    })
    .then((res) => res)
    .catch((error) =>
      //en el caso de usuario ya creado, llega el error 409. Como hacer que esto llegue al front?
      console.log("ACA ESTA EL ERROR EN LOGIN_USER -----> ", error)
    );
});

export const logoutUser = createAsyncThunk("CLEAR_USER", async () => {
  await AsyncStorage.clear();
});

export const userMe = createAsyncThunk("USER_ME", (token) => {
  return axios
    .get(`http://192.168.0.3:3001/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
});

export const addPlan = createAsyncThunk("ADD_PLAN", (plan) => {
  const os = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return AsyncStorage.getItem("token")
    .then((token) => {
      return axios.post(`http://192.168.0.3:3001/api/user/planToAttend`, plan, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
    })
    .then((res) => res.data);
});

export const removePlan = createAsyncThunk("REMOVE_PLAN", (plan) => {
  console.log("este es el plan removido", plan);
  const { id } = plan;
  const os = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return AsyncStorage.getItem("token")
    .then((token) => {
      console.log("axios token ->", JSON.parse(token));
      let tokenParse = JSON.parse(token);
      return axios.delete(`http://192.168.0.3:3001/api/user/deletePlan/${id}`, {
        headers: { Authorization: `Bearer ${tokenParse}` },
      });
    })
    .then((res) => res.data);
  //console.log("llego aca");
});

const userReducer = createReducer(initialState, {
  [createUser.fulfilled]: (state, action) => {
    state.userRegister = action.payload;
  },
  [loginUser.fulfilled]: (state, action) => {
    state.userLogin = action.payload;
  },
  [userMe.fulfilled]: (state, action) => {
    state.me = action.payload;
  },
  [logoutUser.fulfilled]: (state, action) => {
    state.me = {};
  },
  [addPlan.fulfilled]: (state, action) => {
    state.savedPlans = action.payload;
  },
  //revisar logica de aca, tengo que traer todos MENOS el plan que se saco
  [removePlan.fulfilled]: (state, action) => {
    state.savedPlans = action.payload;
  },
});

export default userReducer;
