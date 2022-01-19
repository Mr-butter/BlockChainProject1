import axios from "axios";
import { decryption } from "../../utils/decrypt";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const AUTH_USER = "AUTH_USER";

const serverPort = parseInt(window.location.port) + 2000;
const serverUrl = `http://127.0.0.1:${serverPort}`;

export async function loginUser(password) {
  const loglevel = localStorage.getItem("loglevel");
  if (loglevel === null) {
    alert(
      "클라이언트에 생성된 지갑을 찾을 수 없습니다.\n복구 또는 새로 만들어주세요"
    );
  } else {
    const inputPassword = password;
    const dataToSubmit = {
      password: inputPassword,
      loglevel: loglevel,
    };
    const data = await axios
      .post(`${serverUrl}/login`, dataToSubmit)
      .then((res) => res.data);
    localStorage.setItem("login", JSON.stringify(data));
    return {
      type: LOGIN_USER,
      payload: data,
    };
  }
}

export async function logoutUser() {
  const loginCheck = localStorage.getItem("login");
  if (loginCheck !== null) {
    localStorage.removeItem("login");
    const data = {
      address: "",
      isAuth: false,
    };
    return {
      type: LOGOUT_USER,
      payload: data,
    };
  } else {
    alert("이미 로그아웃 되어있습니다.");
  }
}

export async function auth() {
  const loginCheck = localStorage.getItem("login");
  if (loginCheck !== null) {
    const data = {
      address: JSON.parse(loginCheck).address,
      isAuth: JSON.parse(loginCheck).isAuth,
    };
    return {
      type: AUTH_USER,
      payload: data,
    };
  } else {
    const data = {
      address: "",
      isAuth: false,
    };
    return {
      type: AUTH_USER,
      payload: data,
    };
  }
}
