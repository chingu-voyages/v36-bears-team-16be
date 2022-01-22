const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.post("/create-user", controller.createUser);
router.put("/update-user/:id", controller.updateUser);
router.delete("/:id", controller.deleteUserById);

module.exports = router;
