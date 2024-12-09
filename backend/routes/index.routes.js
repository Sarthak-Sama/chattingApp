const express = require("express");
const router = express.Router();
const indexControllers = require("../controllers/index.controllers");

router.get("/home", indexControllers.homepage)
router.get("/chat", indexControllers.chatpage)

module.exports = router;