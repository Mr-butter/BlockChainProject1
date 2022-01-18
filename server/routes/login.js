const express = require("express");
const router = express.Router();
const ligthWallet = require("eth-lightwallet");

router.post("/", function (req, res) {
    console.log("서버에 들어오나");
    const walletPwdFromUser = req.body.password;
    const decryption = req.body.decryption;
    const parsed = JSON.parse(decryption);

    const keystore = new ligthWallet.keystore.deserialize(parsed);

    const password = walletPwdFromUser.toString();
    const address = keystore.getAddresses();
    console.log(address);
    console.log(password);
    console.log(keystore);
    res.json("안녕");

    // keystore.keyFromPassword(password, function (err, pwDerivedKey) {
    //     if (keystore.isDerivedKeyCorrect(pwDerivedKey)) {
    //         const seed = keystore.getSeed(pwDerivedKey);

    //         let data = {
    //             isError: false,
    //             msg: "지갑 주소 입니다.",
    //             address: address,
    //             isAuth: true,
    //             seed: seed,
    //         };

    //         return res.send(data);
    //     } else {
    //         let data = {
    //             isError: true,
    //             msg: "비밀번호가 달라요!",
    //             address: "",
    //             isAuth: false,
    //             seed: "",
    //         };

    //         return res.send(data);
    //     }
    // });
});

module.exports = router;
