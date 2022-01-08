import axios from "axios";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export async function loginUser(dataToSubmit) {
    console.log("로그인 액션 실행");
    const data = await axios
        .post("/action/login", dataToSubmit, {
            withCredentials: true,
        })
        .then((res) => res.data);
    return {
        type: LOGIN_USER,
        payload: data,
    };
}

export async function logoutUser() {
    const data = await axios.post("/action/logout").then((res) => res.data);
    return {
        type: LOGOUT_USER,
        payload: data,
    };
}
