const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);

module.exports = router;