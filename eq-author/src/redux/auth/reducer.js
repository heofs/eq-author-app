import config from "config";
import { get, isNil } from "lodash";
import { SIGN_IN_USER, SIGN_OUT_USER } from "./actions";

const initialState = {
  user: null,
  verifiedStatus: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SIGN_IN_USER:
      return {
        ...state,
        user: payload,
        verifiedStatus: true,
      };
    case SIGN_OUT_USER:
      return {
        ...state,
        user: null,
        verifiedStatus: true,
      };
    default:
      return state;
  }
};

export const getUser = state => get(state, "auth.user");
export const isSignedIn = () => {
  return (
    config.REACT_APP_AUTH_TYPE === "external" ||
    (localStorage && !isNil(localStorage.getItem("accessToken")))
  );
};
export const verifiedAuthStatus = state => get(state, "auth.verifiedStatus");
