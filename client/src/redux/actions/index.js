import axios from "axios";
import { decryption } from "../../utils/decrypt";

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

export async function auth() {
    const ligthWallet = require('eth-lightwallet')

    const decStr = JSON.parse(decryption(localStorage.getItem('loglevel')))
    const keystore = new ligthWallet.keystore.deserialize(decStr);
    const address = keystore.getAddresses()
    console.log('address---------------', address);

    if (localStorage.getItem('login')) {

        const data = {
            login: localStorage.getItem('login'),
            wallet: address[0],
        }

        return {
            type: AUTH_USER,
            payload: data
        }

    } else {

        const data = {
            login: localStorage.getItem('login'),
            wallet: "",
        }

        return {
            type: AUTH_USER,
            payload: data
        }
    }
}