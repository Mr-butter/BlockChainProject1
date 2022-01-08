import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { withRouter } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://github.com/Mr-butter">
                BlockChainProject1
            </Link>{" "}
            2022.
        </Typography>
    );
}
const theme = createTheme();

function Login(props) {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [isRemember, setIsRemember] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["rememberEmail"]);

    useEffect(() => {
        if (cookies.rememberEmail !== undefined) {
            setEmail(cookies.rememberEmail);
            setIsRemember(true);
        }
    }, []);

    const handleOnChange = (e) => {
        setIsRemember(e.target.checked);
        if (e.target.checked) {
            alert("보안을 위해 공용컴퓨터는 피해주세요");
            setCookie("rememberEmail", Email, { maxAge: 1000 * 60 });
        } else {
            removeCookie("rememberEmail");
        }
    };

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    };
    const onPasswordHanlder = (e) => {
        setPassword(e.currentTarget.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let body = {
            email: Email,
            password: Password,
        };
        await axios
            .post("/login", body, {
                withCredentials: true,
            })
            // .then((res) => console.log(res.data.message));
            .then((res) => {
                alert(res.data.message);
                props.history.push("/mypage");
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ marginTop: 10 }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={Email}
                            onChange={onEmailHandler}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={Password}
                            onChange={onPasswordHanlder}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="remember"
                                    color="primary"
                                    onChange={handleOnChange}
                                    checked={isRemember}
                                />
                            }
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
export default withRouter(Login);
