var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { sequelize } = require("./models");
let cors = require("cors");
const dotenv = require("dotenv");

const session = require("express-session");

dotenv.config();

var main = require("./routes/main");
var register = require("./routes/register");
var login = require("./routes/login");
// var socketServer = require("./routes/socketServer");
var wallet = require("./routes/wallet");
var analytics = require("./routes/analytics");



var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("DB 연결성공");
    })
    .catch((err) => {
        console.error(`DB 연결실패 - ${err}`);
    });
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET || "cookiesecret",
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2,
            secure: false,
        },
    })
);
app.use(cors());

app.use("/", main);
app.use("/register", register);
app.use("/login", login);
// app.use("/socketServer", socketServer);
app.use("/wallet", wallet);
app.use("/analytics", analytics);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("error");
});

module.exports = app;
