import React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function HeaderContainer(props) {
  const dispatch = useDispatch();
  const userstate = useSelector((state) => state.user);

  const routerchange = (e) => {
    let linkName = e.target.textContent;
    props.history.push(`/${linkName}`);
  };

  const renderloginMenu = () => {
    return (
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Button
          variant="contained"
          onClick={routerchange}
          sx={{ mx: 1, fontWeight: "bold" }}
        >
          login
        </Button>
        <Button
          variant="contained"
          onClick={routerchange}
          sx={{ mx: 1, fontWeight: "bold" }}
        >
          register
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: grey[800] }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => props.history.push("/")}
            sx={{
              display: { xs: "none", sm: "block" },
              cursor: "pointer",
            }}
          >
            여기는 광산
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          {renderloginMenu()}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default withRouter(HeaderContainer);
