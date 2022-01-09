import React from "react";

import "./layout.css";

import MainBody from "../../containers/MainBody";

import Sidebar from "../sidebar/Sidebar";
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
                <div className="layout__content-main">
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
