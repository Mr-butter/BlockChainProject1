import axios from "axios";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const AUTH_USER = "AUTH_USER";

export async function loginUser(dataToSubmit) {
    const data = await axios
        .post("/login", dataToSubmit, {
            withCredentials: true,
        })
        .then((res) => res.data);

    return {
        type: LOGIN_USER,
        payload: data,
    };
}

export async function logoutUser() {
    const data = await axios.post("/logout").then((res) => res.data);
    return {
        type: LOGOUT_USER,
        payload: data,
    };
}

export function auth() {
    const data = axios.get(`/auth`)
        .then(res => res.data);

    return {
        type: AUTH_USER,
        payload: data
    }
}

