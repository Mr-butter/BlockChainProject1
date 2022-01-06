var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", function (req, res, next) {
    res.json({ say: "안녕리액트야" });
});

module.exports = router;
