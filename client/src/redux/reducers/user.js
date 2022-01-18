import { LOGIN_USER, LOGOUT_USER, AUTH_USER } from "../actions";

const initialState = {
    login: false,
    wallet: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...initialState,
                login: action.payload.isAuth,
                wallet: action.payload.address,
            };
        case LOGOUT_USER:
            return {
                ...initialState,
                login: false,
                wallet: "",
            };
        case AUTH_USER:
            return {
                ...initialState,
                login: action.payload.login,
                wallet: action.payload.wallet,
            }
        default:
            return state;
    }
}
