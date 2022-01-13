import React, { useState, useEffect, useRef } from "react";

import "./topnav.css";

import { Link } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";

import ThemeMenu from "../themeMenu/ThemeMenu";

import notifications from "../../assets/JsonData/notification.json";

// import styled from "styled-components";

import Password from "../Password/Password";
import NewWallet from "../walletModal/NewWallet";

// import Modal from "../walletModal/Modal";
// import ModalStyles from "../walletModal/ModalStyles";

import Toggle from "./Toggle";

const renderNotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
        <i className={item.icon}></i>
        <span>{item.content}</span>
    </div>
);

const Topnav = () => {
    // const [showModal, setShowModal] = useState(false);

    // const openModal = () => {
    //   setShowModal((prev) => !prev);
    // };

    const [toggled, setToggled] = useState(false);

    const [haveWallet, sethaveWallet] = useState(false);
    // const ClickWallet = useRef(true);

    // const getHaveWallet = () => {
    //   sethaveWallet(false);
    // };

    // useEffect(() => {
    //   sethaveWallet(!haveWallet);
    //   console.log(!haveWallet);
    // }, [haveWallet]);

    // function ClickWallet() {
    //   Promise.resolve()
    //     .then(() => {
    //       setNewWallet((NewWallet) => NewWallet + 1);
    //     })
    //     .then(() => console.log(NewWallet));
    // }

    return (
        <div className="topnav">
            <div className="topnav__search">
                <input type="text" placeholder="Search here..." />
                <i className="bx bx-search"></i>
            </div>

            <div className="topnav__right">
                <Toggle onChange={(e) => setToggled(e.target.checked)} />
                <p>The switch is {toggled ? "on" : "off"}.</p>
            </div>

            <div className="topnav__right">
                <div className="topnav__right-item">
                    <Dropdown
                        className="userpassword-item"
                        icon="bx bx-user"
                        // value={props}
                        // customerToggle={() => renderUserToggle(curr_user)}
                        // contentData={여기에 개인지갑 어드레스 들어와야함}
                        // renderItems={(item, index) => renderUserMenu(item, index)}
                        renderFooter={() =>
                            // <Password onClick={ClickWallet} />
                            haveWallet ? <NewWallet /> : <Password />
                        }
                    ></Dropdown>
                </div>

                <div className="topnav__right-item">
                    <Dropdown
                        icon="bx bx-bell"
                        badge="12"
                        contentData={notifications}
                        renderItems={(item, index) =>
                            renderNotificationItem(item, index)
                        }
                        renderFooter={() => <Link to="/">View All</Link>}
                    />
                </div>

                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
        </div>
    );
};

export default Topnav;

// import user_image from "../../assets/images/tuat.png";

// import user_menu from "../../assets/JsonData/user_menus.json";

// const curr_user = {
//   display_name: "cococoin",
//   image: user_image,
// };

// const renderUserToggle = (user) => (
//   <div className="topnav__right-user">
//     <div className="topnav__right-user__image">
//       <img src={user.image} alt="" />
//     </div>
//     <div className="topnav__right-user__name">{user.display_name}</div>
//   </div>
// );

// const renderUserMenu = (item, index) => (
//   <Link to="/" key={index}>
//     <div className="notification-item">
//       <i className={item.icon}></i>
//       <span>{item.content}</span>
//     </div>
//   </Link>
// );
