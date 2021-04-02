const express = require("express");
const router = express.Router();

const map = require("../map/map.json");

router.get("/", (req, res) => {
    res.send(map);
});

module.exports = router;