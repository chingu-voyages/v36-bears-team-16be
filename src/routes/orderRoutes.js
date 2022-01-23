const express = require("express");
const router = express.Router();
const controller = require("../controllers/ordersController");

router.get("/users/:userId", controller.getOrdersByUserId);
router.get("/restaurants/:restaurantId", controller.getOrdersByRestaurantId);

module.exports = router;
