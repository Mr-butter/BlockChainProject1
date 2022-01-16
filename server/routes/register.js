const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { User } = require("../models");
const bcrypt = require("bcrypt");


const router = express.Router();

/* uploads 폴더 */
try {
    fs.readdirSync("uploads");
} catch (error) {
    console.error("uploads 폴더가 없어 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
}

/* multer 기본 설정 */
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, "uploads/");
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fieldSize: 5 * 1024 * 1024 },
});
router.post("/", upload.single("img"), async (req, res, next) => {
    console.log("여기 들어옵니까?");
    const { nickname, email, password } = req.body;
    const imgurl = () => {
        if (req.file === undefined) {
            return "";
        }
        return `/img/${req.file.filename}`;
    };
    try {
        const checkDbUser = await User.findOne({ where: { email } });
        if (checkDbUser) {
            return res.json({
                registerSuccess: false,
                message: "이미 가입되어 있습니다.",
            });
        }
        const hash = await bcrypt.hash(password, 12);
        User.create({
            nick: nickname,
            email,
            password: hash,
            img: imgurl(),
            point: 1000,
        });
        return res.json({
            registerSuccess: true,
            message: "가입을 축하드립니다.\n가입축하 1000 포인트 지급.",
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;
