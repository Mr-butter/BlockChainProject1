const fs = require("fs");
const ecdsa = require("elliptic");
const ec = new ecdsa.ec("secp256k1");

const _ = require('lodash');
const TX = require("./transaction");

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key";

// 지갑 초기화
function initWallet() {
    // 지갑이 이미 있으면 아무것도 하지 않고 기존 지갑 알림
    if (fs.existsSync(privateKeyFile)) {
        console.log("기존 지갑 경로 : " + privateKeyFile);
        return { message: "기존지갑경로가 있습니다." };
    }
    if (!fs.existsSync("wallet/")) {
        fs.mkdirSync("wallet/");
    }
    if (!fs.existsSync(privateKeyLocation)) {
        fs.mkdirSync(privateKeyLocation);
    }

    // 지갑 생성
    const newPrivateKey = generatePrivatekey();
    // 지갑 경로 생성
    fs.writeFileSync(privateKeyFile, newPrivateKey);
    console.log("새로운 지갑경로 생성 경로 : " + privateKeyFile);
    return { message: "지갑이 잘 생성되었습니다." };
}

// 지갑 삭제
const deleteWallet = () => {
    if (fs.existsSync(privateKeyLocation)) {
      fs.unlinkSync(privateKeyLocation);
    }
}

// 비밀키 생성
function generatePrivatekey() {
    const keyPair = ec.genKeyPair();
    const privatekey = keyPair.getPrivate();
    return privatekey.toString(16);
}

// 지갑에서 비밀키 가져오기
function getPrivateKeyFromWallet() {
    const buffer = fs.readFileSync(privateKeyFile, "utf8");
    return buffer.toString();
}

// 지갑에서 공개키 가져오기
function getPublicKeyFromWallet() {
    // const privatekey = getPrivateKeyFromWallet();
    const privatekey = "0x5fbfdc01bf54191d146103853b2481bdc81e7c0d";
    const key = ec.keyFromPrivate(privatekey, "hex");
    return key.getPublic().encode("hex");
}
console.log(getPublicKeyFromWallet());

console.log('getPublicFromWallet::: 지갑 주소!\n', getPublicFromWallet());

module.exports = {
    initWallet,
    generatePrivatekey,
    getPrivateKeyFromWallet,
    getPublicKeyFromWallet,
};
