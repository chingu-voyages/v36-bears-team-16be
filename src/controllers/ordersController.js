require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const getOrdersByUserId = (req, res) => {
  const userId = parseInt(req.params.userId);
  pool.query(
    `WITH order_details AS
    (SELECT omi.order_id, SUM(menu_items.price * omi.quantity) AS total,
           STRING_AGG(menu_items.name || '(' || omi.quantity || ')', ', ') AS order_contents
      FROM menu_items
           INNER JOIN orders_menu_items AS omi
               ON omi.menu_item_id = menu_items.id
    GROUP BY omi.order_id)
  
    SELECT orders.id AS order_id, users.username AS customer, restaurants.name AS restaurant_name, orders.status,
           datetime_order_placed, order_details.order_contents AS contents, order_details.total AS total_price
    FROM users
         INNER JOIN orders
             ON users.id = orders.user_id
         INNER JOIN restaurants
             ON orders.restaurant_id = restaurants.id
         INNER JOIN order_details
             ON order_details.order_id = orders.id
    WHERE users.id = $1`, [userId],
    (error, results) => {
      if (error) {
        res.status(500).send(error.toString());
      } else {
        res.status(200).json(results.rows);
      }
    });
};

const getOrdersByRestaurantId = (req, res) => {
  const restaurantId = parseInt(req.params.restaurantId);
  pool.query(
    `WITH order_details AS
    (SELECT omi.order_id, SUM(menu_items.price * omi.quantity) AS total,
           STRING_AGG(menu_items.name || '(' || omi.quantity || ')', ', ') AS order_contents
      FROM menu_items
           INNER JOIN orders_menu_items AS omi
               ON omi.menu_item_id = menu_items.id
    GROUP BY omi.order_id)
  
    SELECT orders.id AS order_id, users.username AS customer, orders.status,
           datetime_order_placed, order_details.order_contents AS contents, order_details.total AS total_price
    FROM users
         INNER JOIN orders
             ON users.id = orders.user_id
         INNER JOIN restaurants
             ON orders.restaurant_id = restaurants.id
         INNER JOIN order_details
             ON order_details.order_id = orders.id
    WHERE restaurants.id = $1`, [restaurantId],
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

const updateOrder = (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const { paid, order_recieved, in_process, done, cancelled, user_recieved } =
    req.body;

  pool.query(
    "UPDATE orders SET paid = $1, order_recieved = $2, in_process = $3, done = $4, cancelled = $5, user_recieved = $6 WHERE id = $7",
    [paid, order_recieved, in_process, done, cancelled, user_recieved, orderId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Modified order with ID: ${orderId}`);
    }
  );
};

module.exports = {
  getOrdersByUserId,
  getOrdersByRestaurantId,
  createOrder,
  updateOrder,
};
