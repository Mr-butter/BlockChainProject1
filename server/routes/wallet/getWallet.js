const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const LocalStoreServer = req.body.get
  console.log('로컬스토리지 server 확인 : ', LocalStoreServer);
  res.json({ LocalStoreServer: LocalStoreServer })
});

module.exports = router;