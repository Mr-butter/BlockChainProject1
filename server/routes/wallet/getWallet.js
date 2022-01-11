const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const LS = req.body.get
  console.log(req.body.get);
  res.json({ LS: LS })
});

module.exports = router;