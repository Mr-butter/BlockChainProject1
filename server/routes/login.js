const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../models/middlewares");
const { User } = require("../models");

const router = express.Router();

//로그인 라우터
router.post("/", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.send(info);
            // return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.send(info);
            // return res.send(JSON.parse(JSON.stringify(user)));
        });
    })(req, res, next);
});

module.exports = router;
