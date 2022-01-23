require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

const getOrdersByUserId = (req, res) => {
  const userId = parseInt(req.params.userId);
  pool.query(
    "SELECT * FROM orders WHERE user_id = $1",
    [userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getOrdersByRestaurantId = (req, res) => {
  const restaurantId = parseInt(req.params.restaurantId);
  pool.query(
    "SELECT * FROM orders WHERE restaurant_id = $1",
    [restaurantId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const createOrder = (req, res) => {
  const { restaurant_id, user_id } = req.body;

  pool.query(
    "INSERT INTO orders (restaurant_id,user_id) VALUES ($1, $2)",
    [restaurant_id, user_id],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
  pool.query(
    "SELECT * FROM orders ORDER BY ID DESC LIMIT 1",
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .json(`Inserted new orders with ID: ${results.rows[0].id}`);
    }
  );
};

module.exports = {
  getOrdersByUserId,
  getOrdersByRestaurantId,
  createOrder,
};
