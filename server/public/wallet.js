const { keystore } = require("eth-lightwallet");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const UserWallet = require("../models/userWallet");
const ecdsa = require("elliptic");
const ec = new ecdsa.ec("secp256k1");

const getPublicKey = (aPrivateKey) => {
    return ec.keyFromPrivate(aPrivateKey, "hex").getPublic().encode("hex");
};

function encryption(data) {
    const key = "process.env.ENCRYPTION_KEY";
    const iv = "process.env.ENCRYPTION_IV";

    const keyutf = CryptoJS.enc.Utf8.parse(key);
    const ivutf = CryptoJS.enc.Utf8.parse(iv);
    const encObj = CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, {
        iv: ivutf,
    });
    const encStr = encObj + "";
    return encStr;
}

function decryption(encStr) {
    const key = "process.env.ENCRYPTION_KEY";
    const iv = "process.env.ENCRYPTION_IV";

    const keyutf = CryptoJS.enc.Utf8.parse(key);
    const ivutf = CryptoJS.enc.Utf8.parse(iv);
    const decObj = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(encStr) },
        keyutf,
        { iv: ivutf }
    );
    const decStr = CryptoJS.enc.Utf8.stringify(decObj);
    return decStr;
}

const getmnemonic = () => {
    const mnemonic = keystore.generateRandomSeed();
    return mnemonic;
};
const password = 1234;
const seedPhrase = getmnemonic();

keystore.createVault(
    {
        password: password,
        seedPhrase: seedPhrase,
        hdPathString: "m/0'/0'/0'",
    },
    (err, ks) => {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
            if (err) throw err;

            // generate five new address/private key pairs
            // the corresponding private keys are also encrypted
            ks.generateNewAddress(pwDerivedKey, 1);
            const address = ks.getAddresses();
            const public = ec
                .keyFromPrivate(address, "hex")
                .getPublic()
                .encode("hex");
            console.log(address);
            console.log(public);
            const keystore = ks.serialize();
        });
    }
);

// const getKeystore = (password, seedPhrase) => {
//     new keystore.createVault(
//         {
//             password: password,
//             seedPhrase: seedPhrase,
//             hdPathString: "m/0'/0'/0'",
//         },
//         function (err, ks) {
//             // Some methods will require providing the `pwDerivedKey`,
//             // Allowing you to only decrypt private keys on an as-needed basis.
//             // You can generate that value with this convenient method:
//             ks.keyFromPassword(password, function (err, pwDerivedKey) {
//                 if (err) throw err;

//                 // generate five new address/private key pairs
//                 // the corresponding private keys are also encrypted
//                 ks.generateNewAddress(pwDerivedKey, 1);
//                 const addr = ks.getAddresses();
//                 const userkeystore = ks.serialize();
//                 console.log(addr);
//                 console.log(userkeystore);

//                 ks.passwordProvider = function (callback) {
//                     var pw = prompt("Please enter password", "Password");
//                     callback(null, pw);
//                 };

//                 // Now set ks as transaction_signer in the hooked web3 provider
//                 // and you can start using web3 using the keys/addresses in ks!
//             });
//         }
//     );
// };
// console.log(getKeystore(password, seedPhrase));
