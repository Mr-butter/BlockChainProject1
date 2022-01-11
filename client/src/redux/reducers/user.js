import { LOGIN_USER, LOGOUT_USER } from "../actions";

const initialState = {
    userid: "",
    nick: "",
    login: false,
    profileurl: "",
    point: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...initialState,
                userid: action.payload.userid,
                nick: action.payload.nick,
                login: action.payload.login,
                profileurl: action.payload.profileurl,
                point: action.payload.point,
            };
        case LOGOUT_USER:
            return {
                ...initialState,
                userid: "",
                nick: "",
                login: false,
                profileurl: "",
                point: "",
            };
        default:
            return state;
    }
}
