import React, { useEffect, useRef, useState } from "react";

import "./layout.css";

// import MainBody from "../../containers/MainBody";

import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";
import { Route } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import ThemeAction from "../../redux/actions/ThemeAction";
import {
    auth,
    getblock,
    messageFromSocket,
    userAmount,
} from "../../redux/actions/index";
import axios from "axios";

const Layout = () => {
    const themeReducer = useSelector((state) => state.ThemeReducer);
    const userState = useSelector((state) => state.User);
    const dispatch = useDispatch();
    const ws = useRef(null);
    const serverPort = parseInt(window.location.port) + 2000;
    const serverUrl = `http://127.0.0.1:${serverPort}`;
    const [socketMessage, setSocketMessage] = useState(null);

    useEffect(() => {
        const colorClass = localStorage.getItem("colorMode", "theme-mode-dark");

        dispatch(ThemeAction.setColor(colorClass));
        dispatch(auth());
    }, [dispatch]);

    useEffect(() => {
        ws.current = new WebSocket(`ws://127.0.0.1:6001/`);
        ws.current.onopen = () => {
            // connection opened
            console.log(ws.current.readyState);
            console.log(`웹소켓 포트 : 6001 번으로 연결`);
            // send a message
        };

        ws.current.onmessage = async (e) => {
            // a message was received
            let reciveData = await JSON.parse(JSON.parse(e.data).data);
            setSocketMessage(reciveData);
        };
        ws.current.onclose = () => {
            console.log("///////////////" + ws.current.readyState);
            console.log("종료되었습니다.");
        };
        return () => {
            console.log("페이지이동시 실행 확인");
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        dispatch(getblock());
        dispatch(userAmount(userState.address));
        dispatch(messageFromSocket(socketMessage));
    }, [socketMessage]);

    return (
        <Route
            render={(props) => (
                <div
                    className={`layout theme-mode-dark" ${themeReducer.color}`}
                >
                    <Sidebar {...props} />
                    <div className="layout__content">
                        <TopNav />
                        <div className="layout__content-main">
                            <Routes />
                        </div>
                    </div>
                </div>
            )}
        />
    );
};

export default Layout;
