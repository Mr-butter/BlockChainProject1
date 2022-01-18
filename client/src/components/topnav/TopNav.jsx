import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./topnav.css";

import ThemeMenu from "../themeMenu/ThemeMenu";

import Password from "../Password/Password";
import NewWallet from "../walletModal/NewWallet";
import Pwd from "../Password/Pwd";
import ForgotPwd from "../Password/ForgetPwd";

import { Button, Menu, MenuItem, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import Toggle from "./Toggle";

const Topnav = (props) => {
    const loginInfo = useSelector((state) => state.user);
    const address = loginInfo.wallet;
    const p2pport = parseInt(window.location.port) + 3000;
    const [toggled, setToggled] = useState(false);

    const [haveWallet, sethaveWallet] = useState("pass");
    const [AnchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(AnchorEl);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        sethaveWallet("pass");
    };

    useEffect(() => {
        switch (toggled) {
            case true:
                axios
                    .post("/mineBlock", { switchOnOff: "on", p2pport: p2pport })
                    .then((res) => {
                        const data = res.data.message;
                        console.log(data);
                    });
                break;

            default:
                break;
        }
    }, [toggled]);

    useEffect(() => {}, [haveWallet]);

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
                        setAnchorEl={setAnchorEl}
                    ></Password>
                );
            case "forgot":
                return (
                    <ForgotPwd
                        haveWallet={haveWallet}
                        sethaveWallet={sethaveWallet}
                        setAnchorEl={setAnchorEl}
                    ></ForgotPwd>
                );
            case "wallet":
                return (
                    <NewWallet
                        haveWallet={haveWallet}
                        sethaveWallet={sethaveWallet}
                        setAnchorEl={setAnchorEl}
                    ></NewWallet>
                );
            case "pwd":
                return (
                    <Pwd
                        haveWallet={haveWallet}
                        sethaveWallet={sethaveWallet}
                        setAnchorEl={setAnchorEl}
                    ></Pwd>
                );
            default:
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
            <div>{address}</div>
            <div className="topnav__right">
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
                    <ThemeMenu />
                </div>
            </div>
        </div>
    );
};
export default Topnav;
