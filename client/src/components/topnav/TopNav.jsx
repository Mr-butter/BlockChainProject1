import React, { useState, useEffect } from "react";

import "./topnav.css";

import { Link } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";

import ThemeMenu from "../themeMenu/ThemeMenu";

import notifications from "../../assets/JsonData/notification.json";

// import styled from "styled-components";

import Password from "../Password/Password";
import NewWallet from "../walletModal/NewWallet";
import Pwd from "../Password/Pwd";

import Click from "../topnav/Click";

import { Button, Menu, MenuItem, Box } from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

import Toggle from "./Toggle";

// const Button = styled.button`
//   padding: 16px 32px;
//   border-radious: 30%;
//   background: #333333;
//   color: gold;
//   font-size: 24px;
//   margin-left: 44%;
//   margin-bottom: 20%;
//   cursor: pointer;
// `;

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const Topnav = (props) => {
  const [toggled, setToggled] = useState(false);
  const [haveWallet, sethaveWallet] = useState("pass");
  const [AnchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(AnchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log(toggled);
  }, [toggled]);

  useEffect(() => {
    console.log(haveWallet);
  }, [haveWallet]);

  const usericon = {
    fontSize: 37,
    color: "#dbd5d5",
  };
  function returnMenu(haveWallet) {
    switch (haveWallet) {
      case "pass":
        return (
          <Password
            haveWallet={haveWallet}
            sethaveWallet={sethaveWallet}
          ></Password>
        );
      case "wallet":
        return (
          <NewWallet
            haveWallet={haveWallet}
            sethaveWallet={sethaveWallet}
          ></NewWallet>
        );
      case "pwd":
        return (
          <Pwd haveWallet={haveWallet} sethaveWallet={sethaveWallet}></Pwd>
        );
    }
  }

  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>

      <div className="topnav__right">
        <Toggle
          onChange={(e) => {
            setToggled(e.target.checked);
          }}
        />
        <p>The switch is {toggled ? "on" : "off"}.</p>
      </div>
      {/* <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <Button onClick={handleMenuOpen} sx={{ p: 0 }}>
            테스트 버튼
          </Button>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={AnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(AnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem>
            <Password></Password>
          </MenuItem>
        </Menu>
      </Box> */}

      <div className="topnav__right">
        {/* 추후에 아래 지갑Modal버튼은 지울예정 */}
        {/* -<div className="topnav__right-item">
          <Button onClick={openModal}>Get Started</Button>
          <Modal showModal={showModal} setShowModal={setShowModal} />
        </div> */}

        <div className="topnav__right-item">
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <Button onClick={handleMenuOpen} sx={{ p: 0 }}>
                <i class="bx bx-user" style={usericon} />
              </Button>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={AnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(AnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem>{returnMenu(haveWallet)}</MenuItem>
            </Menu>
          </Box>
        </div>

        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
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
