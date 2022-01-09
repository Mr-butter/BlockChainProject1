import React from "react";

import "./layout.css";

import MainBody from "../../containers/MainBody";

import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";

import { BrowserRouter, Route } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <BrowserRouter>
        <Route
          render={(props) => (
            <div className="layout">
              <Sidebar {...props} />
              <div className="layout__content">
                <TopNav />
                <div className="layout__content-main">
                  {/* 아래 mainBody는 로그인, 회원가입만 따로 떼어낼 예정 */}
                  <MainBody />
                  <Routes />
                </div>
              </div>
            </div>
          )}
        />
      </BrowserRouter>
    </div>
  );
};

export default Layout;
