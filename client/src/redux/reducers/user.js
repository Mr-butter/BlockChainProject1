import { LOGIN_USER, LOGOUT_USER, AUTH_USER, USER_AMOUNT } from "../actions";

const initialState = {
  isAuth: false,
  address: "",
  amount: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuth: action.payload.isAuth,
        address: action.payload.address,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuth: action.payload.isAuth,
        address: action.payload.address,
      };
    case AUTH_USER:
      return {
        ...state,
        isAuth: action.payload.isAuth,
        address: action.payload.address,
      };
    case USER_AMOUNT:
      return {
        ...state,
        amount: action.payload,
      };
    default:
      return state;
  }
}
