const passport = require("passport");
const local = require("./localStrategy");
const { User } = require("../models");

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({
                where: { id },
                attributes: ["id", "nick", "img"],
            });
            done(null, user); // req.user
        } catch (error) {
            console.error(error);
            done(error);
        }
    });
    local();
};
