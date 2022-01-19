const express = require("express");
const router = express.Router();
const BlockChainDB = require("../models/blocks");

router.post("/", async function (req, res) {
  const analytics = await BlockChainDB.findAll({});
  console.log("///////////////////////////////////");
  console.log(analytics[0].dataValues);
  const arr = [];
  for (let i = 0; i < analytics.length; i++) {
    const block = analytics[i].dataValues;

    arr.push(block);
  }

  //   arr.push(analytics[0].dataValues);
  //   arr.push(analytics[1].dataValues);
  console.log(arr);
  return res.send({ allBlocks: arr });
});

module.exports = router;
