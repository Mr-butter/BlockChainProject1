import React, { useEffect } from "react";

import "./layout.css";

// import MainBody from "../../containers/MainBody";

import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";

import { Route } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import ThemeAction from "../../redux/actions/ThemeAction";
import { auth } from "../../redux/actions/index";

const Layout = () => {
  const themeReducer = useSelector((state) => state.ThemeReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    const themeClass = localStorage.getItem("themeMode", "theme-mode-light");

    const colorClass = localStorage.getItem("colorMode", "theme-mode-light");

    // const loginClass = localStorage.getItem("login", "true");
    // console.log(loginClass);

    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
    dispatch(auth());
  }, [dispatch]);

  return (
    <Route
      render={(props) => (
        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
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
