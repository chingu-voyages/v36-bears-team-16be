const express = require("express");
const router = express.Router();
const controller = require("../controllers/ordersController");

router.get("/users/:userId", controller.getOrdersByUserId);
router.get("/restaurants/:restaurantId", controller.getOrdersByRestaurantId);
router.post("/", controller.createOrder);

module.exports = router;
