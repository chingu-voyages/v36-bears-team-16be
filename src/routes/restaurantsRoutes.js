const express = require("express");
const router = express.Router();
const controller = require("../controllers/restaurantsController");

router.get("/owner/:ownerId", controller.getRestaurantByOwnerId);
router.get("/", controller.getRestaurantByName);

module.exports = router;
