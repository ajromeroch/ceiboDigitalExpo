import axios from "axios";

import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";

import { Platform } from "react-native";

// const os = Platform.OS !== "android" ? "localhost" : "10.0.2.2";

const initialState = {
  plans: [],
  singlePlan: {},
  searchedPlans: [],
  addedAllPlans: [],
};
const ip = "192.168.0.3";
const os = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const showPlans = createAsyncThunk("SHOW_PLANS", () => {
  return axios
    .get(`http://${os}:3001/api/plan`)
    .then((res) => res.data)
    .catch((error) =>
      console.log("ACA ESTA EL ERROR EN SHOW_PLANS -----> ", error)
    );
});

export const showSinglePlan = createAsyncThunk("SHOW_SINGLE_PLAN", (param) => {
  return axios
    .get(`http://${os}:3001/api/plan/${param}`)
    .then((res) => res.data)
    .catch((error) =>
      console.log("ACA ESTA EL ERROR EN SINGLE PLAN -----> ", error)
    );
});

export const searchPlans = createAsyncThunk("SEARCH_PLANS", (namePlan) => {
  console.log("este es el namePLan", namePlan);

  if (namePlan.fromModal) {
    return axios
      .post(`http://${os}:3001/api/plan/search/multipleFilter`, namePlan)
      .then((res) => {
        return res.data;
      })
      .catch((error) =>
        console.log("ACA ESTA EL ERROR EN SEARCH PLANS MODALS-----> ", error)
      );
  } else if (namePlan.query !== "" && namePlan.fromSearch) {
    return axios
      .get(`http://${os}:3001/api/plan/search?name=${namePlan.query}`)
      .then((res) => {
        console.log("dentro del segundo, length", res.data.length);
        return res.data;
      })
      .catch((error) =>
        console.log("ACA ESTA EL ERROR EN SEARCH PLANS SEARCH-----> ", error)
      );
  } else if (namePlan.type) {
    return axios
      .get(`http://${os}:3001/api/plan/category/${namePlan.type}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) =>
        console.log("ACA ESTA EL ERROR EN SEARCH PLANS CATEGORY-----> ", error)
      );
  } else return [];
});

export const addedPlans = createAction("ADDED_PLANS");
export const removedPlans = createAction("REMOVED_PLANS");

const plansReducer = createReducer(initialState, {
  [showPlans.fulfilled]: (state, action) => {
    state.plans = action.payload;
  },
  [showSinglePlan.fulfilled]: (state, action) => {
    state.singlePlan = action.payload;
  },
  [searchPlans.fulfilled]: (state, action) => {
    state.searchedPlans = action.payload;
  },
  [addedPlans]: (state, action) => {
    console.log("este es el userPlans que llega al estado", action.payload);
    if (typeof action.payload === "string") {
      const auxState = [...state.addedAllPlans, action.payload];
      state.addedAllPlans = [...new Set(auxState)];
    } else {
      const auxState = [...state.addedAllPlans, ...action.payload];
      state.addedAllPlans = [...new Set(auxState)];
    }
  },
  [removedPlans]: (state, action) => {
    // Aca siempre va a llegar solo un string
    console.log("este es el userPlans que llega al estado", action.payload);
    const filteredPlans = state.addedAllPlans.filter(
      (planId) => planId !== action.payload
    );
    state.addedAllPlans = filteredPlans;
  },
});

export default plansReducer;
