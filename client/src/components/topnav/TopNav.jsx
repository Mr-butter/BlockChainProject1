import React from "react";

import "./topnav.css";

import { Link } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";

import notifications from "../../assets/JsonData/notification.json";

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const Topnav = () => {
  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          <Dropdown icon="bx bx-user" />
          {/* 여기에 드롭다운바 만들기 */}
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItem={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
          {/* 여기에 드롭다운바 만들기 */}
        </div>
        <div className="topnav__right-item">
          <Dropdown />
          {/* 테마세팅 */}
        </div>
      </div>
    </div>
  );
};

export default Topnav;
