
const express = require("express");
const router = express.Router();
const ligthWallet = require('eth-lightwallet')
//const isNullOrUndefined = require('util');


router.post('/', function (req, res) {
    //console.log(req.body);
    const walletPwdFromUser = req.body.password
    // const LocalStoreServer = req.body.keystore
    const decryption = req.body.decryption
    console.log();

    const parsed = JSON.parse(decryption)
    //console.log("parsed****************", parsed);

    const keystore = new ligthWallet.keystore.deserialize(parsed);


    // if (LocalStoreServer === null) {
    //     let data = {
    //         isError: true,
    //         msg: '저장된 지갑이 없습니다.',
    //         address: "",
    //         isAuth: false,
    //     };

    //     return res.send(data);
    // }

    const password = walletPwdFromUser.toString();
    const address = keystore.getAddresses()
    console.log('address---------------', address);
    //console.log(password);

    keystore.keyFromPassword(password, function (err, pwDerivedKey) {
        if (keystore.isDerivedKeyCorrect(pwDerivedKey)) {
            const seed = keystore.getSeed(pwDerivedKey)
            //const privatekey = keystore.exportPrivateKey(address, pwDerivedKey)
            console.log("seed---------", seed);
            //console.log("privatekey---------", privatekey);
            let data = {
                isError: false,
                msg: '지갑 주소 입니다.',
                address: address,
                isAuth: true,
                seed: seed,
            }
            console.log("data-----------------------", data);

            return res.send(data);

        } else {
            let data = {
                isError: true,
                msg: '비밀번호가 달라요!',
                address: "",
                isAuth: false,
                seed: "",
            };
            console.log("error-----------------------", data);

            return res.send(data);
        }
    });

});

module.exports = router; 