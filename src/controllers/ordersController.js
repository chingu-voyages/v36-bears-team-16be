require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool(
  process.env.NODE_ENV === "dev"
    ? { connectionString: process.env.TEST_DATABASE_URL }
    : {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
);

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
           created, order_details.order_contents AS contents, order_details.total AS total_price
    FROM users
         INNER JOIN orders
             ON users.id = orders.user_id
         INNER JOIN restaurants
             ON orders.restaurant_id = restaurants.id
         INNER JOIN order_details
             ON order_details.order_id = orders.id
    WHERE users.id = $1`,
    [userId],
    (error, results) => {
      if (error) {
        res.status(500).send(error.toString());
      }
      res.status(200).json(results.rows);
    }
  );
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
           created, order_details.order_contents AS contents, order_details.total AS total_price
    FROM users
         INNER JOIN orders
             ON users.id = orders.user_id
         INNER JOIN restaurants
             ON orders.restaurant_id = restaurants.id
         INNER JOIN order_details
             ON order_details.order_id = orders.id
    WHERE restaurants.id = $1`,
    [restaurantId],
    (error, results) => {
      if (error) {
        res.status(500).send(error.toString());
      }
      res.status(200).json(results.rows);
    }
  );
};

const createOrder = async (req, res) => {
  const { user_id, restaurant_id, items, status, paid } = req.body;

  let values = [user_id, restaurant_id, status, paid];
  console.log("values set");

  // Build part of query that inserts items
  let valueCount = values.length;
  const subparts = [];
  let itemsQuerySection =
    "INSERT INTO orders_menu_items(order_id, menu_item_id, quantity) VALUES ";
  items.forEach((item) => {
    subparts.push(
      `((SELECT id FROM order_result), $${++valueCount}, $${++valueCount})`
    );
    const itemValues = [item.menu_item_id, item.quantity];
    values = values.concat(itemValues);
  });
  itemsQuerySection =
    itemsQuerySection + subparts.join(", ") + " RETURNING order_id";

  try {
    const queryResults = await pool.query(
      `WITH order_result AS
         (INSERT INTO orders (user_id, restaurant_id, status, paid)
          VALUES
            ($1, $2, $3, $4)
          RETURNING *) ` + itemsQuerySection,
      values
    );

    res.status(201).send(`Order ${queryResults.rows[0].order_id} added`);
  } catch (error) {
    res.status(500).json(itemsQuerySection + " " + error.toString());
  }
};

const updateOrderStatus = (req, res) => {
  const orderId = parseInt(req.params.orderId);
  const { paid, status } = req.body;

  pool.query(
    "UPDATE orders SET paid = $1, status =$2 WHERE id = $3",
    [paid, status, orderId],
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
  updateOrderStatus,
};
