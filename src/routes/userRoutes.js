const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.post("/create-user", controller.createUser);
router.delete("/:id", controller.deleteUserById);

module.exports = router;
