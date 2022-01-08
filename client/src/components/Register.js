import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { withRouter } from "react-router-dom";
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

function Register(props) {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Nickname, setNickname] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Previewimg, setPreviewimg] = useState("");
    const [UPloadImg, setUPloadImg] = useState("");
    const [PatternCheck, setPatternCheck] = useState({
        email: false,
        password: false,
        passwordconfirm: false,
        nickname: false,
    });

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    };

    const onNicknameHandler = (e) => {
        setNickname(e.currentTarget.value);
    };

    const onPasswordHanlder = (e) => {
        setPassword(e.currentTarget.value);
    };

    const onConfirmPasswordHandler = (e) => {
        setConfirmPassword(e.currentTarget.value);
    };

    const onProfileimgHandler = (e) => {
        const imageFile = e.target.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        setUPloadImg(imageFile);
        setPreviewimg(imageUrl);
    };

    const onblurPattonCheck = (e) => {
        const currentTargetName = e.currentTarget.getAttribute("id");
        switch (currentTargetName) {
            case "email":
                const checkEmail =
                    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
                if (!checkEmail.test(e.currentTarget.value)) {
                    return setPatternCheck({ ...PatternCheck, email: true });
                }
                return setPatternCheck({ ...PatternCheck, email: false });
            case "password":
                const checkpassword =
                    /^(?=.*[A-Za-z0-9])(?=.*[$@$!%*#?&])[A-Za-z0-9$@$!%*#?&]{6,16}$/;
                if (!checkpassword.test(e.currentTarget.value)) {
                    return setPatternCheck({ ...PatternCheck, password: true });
                }
                return setPatternCheck({ ...PatternCheck, password: false });
            case "confirmpassword":
                if (Password === ConfirmPassword) {
                    return setPatternCheck({
                        ...PatternCheck,
                        passwordconfirm: false,
                    });
                }
                return setPatternCheck({
                    ...PatternCheck,
                    passwordconfirm: true,
                });

            default:
                console.log("입력란을 확인해주세요.");
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("2222222222");
        const formData = new FormData();
        formData.append("img", UPloadImg);
        formData.append("email", Email);
        formData.append("nickname", Nickname);
        formData.append("password", Password);

        if (Password === ConfirmPassword) {
            const axiosconfig = {
                withCredentials: true,
            };
            await axios.post("/register", formData, axiosconfig).then((res) => {
                if (res.data.registerSuccess) {
                    alert(res.data.message);
                    props.history.push("/login");
                } else {
                    alert(res.data.message);
                }
            });
        } else {
            alert("비밀번호를 확인해주세요.");
        }
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
                        Register
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            mt: 3,
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={Email}
                                    onChange={onEmailHandler}
                                    onBlur={onblurPattonCheck}
                                    error={PatternCheck.email}
                                    helperText={
                                        PatternCheck.email
                                            ? "이메일주소를 입력해주세요"
                                            : ""
                                    }
                                    // inputProps={{
                                    //     pattern:
                                    //         '[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}',
                                    // }}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={Password}
                                    onChange={onPasswordHanlder}
                                    onBlur={onblurPattonCheck}
                                    error={PatternCheck.password}
                                    helperText={
                                        PatternCheck.password
                                            ? "6~16자 이내로 작성해주세요(특수기호 포함)"
                                            : "6~16자 이내로 작성해주세요(특수기호 포함)"
                                    }
                                    // inputProps={{
                                    //     pattern:
                                    //         '(?=.*[A-Za-z0-9])(?=.*[$@$!%*#?&])[A-Za-z0-9$@$!%*#?&]{6,16}',
                                    // }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmpassword"
                                    label="Password Check"
                                    type="password"
                                    id="confirmpassword"
                                    value={ConfirmPassword}
                                    onChange={onConfirmPasswordHandler}
                                    onBlur={onblurPattonCheck}
                                    error={PatternCheck.passwordconfirm}
                                    helperText={
                                        PatternCheck.passwordconfirm
                                            ? "비밀번호가 일치하지 않습니다."
                                            : ""
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="nickname"
                                    required
                                    fullWidth
                                    id="nickname"
                                    label="Nick Name"
                                    value={Nickname}
                                    onChange={onNicknameHandler}
                                    helperText={"2글자 이상 작성해주세요"}
                                    // inputProps={{
                                    //     pattern:
                                    //         '[가-힣a-zA-Z0-9$@$!%*#?&]{2,20}',
                                    // }}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Avatar
                                    sx={{ width: 200, height: 200 }}
                                    variant="rounded"
                                    src={Previewimg}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <label htmlFor="profileimg">
                                    <Box
                                        component="input"
                                        type="file"
                                        id="profileimg"
                                        name="profileimg"
                                        accept="img/*"
                                        onChange={onProfileimgHandler}
                                        sx={{ display: "none" }}
                                    />
                                    <Button variant="outlined" component="span">
                                        프로필 이미지
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link
                                    onClick={() => {
                                        props.history.push("/login");
                                    }}
                                    sx={{ cursor: "pointer" }}
                                    variant="body2"
                                >
                                    계정이 있으신가요? 바로 로그인 하세요!
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
export default withRouter(Register);
