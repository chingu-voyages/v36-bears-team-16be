require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

const getRestaurantByOwnerId = (req, res) => {
  const ownerId = parseInt(req.params.ownerId);
  pool.query(
    "SELECT * FROM restaurants WHERE owner = $1",
    [ownerId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getRestaurantByName = (req, res) => {
  const name = req.query.name.toLowerCase();
  pool.query(
    `SELECT * FROM restaurants WHERE lower(name) LIKE '${name}%' LIMIT 3`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

const createRestaurantByName = (req, res) => {
  const {
    name,
    phone,
    restaurant_address,
    hours,
    delivery,
    owner,
    irl_payment_only,
  } = req.body;

  pool.query(
    "INSERT INTO restaurants (name,phone,restaurant_address,hours,delivery,owner,irl_payment_only) VALUES ($1, $2,$3, $4, $5, $6, $7)",
    [name, phone, restaurant_address, hours, delivery, owner, irl_payment_only],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
  pool.query(
    "SELECT * FROM restaurants ORDER BY ID DESC LIMIT 1",
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .json(`Inserted new restaurant with ID: ${results.rows[0].id}`);
    }
  );
};

const deleteRestaurantById = (req, res) => {
  const id = parseInt(req.params.restaurantId);
  pool.query(
    "DELETE FROM restaurants WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Restaurant deleted with ID: ${id}`);
    }
  );
};

module.exports = {
  getRestaurantByOwnerId,
  getRestaurantByName,
  createRestaurantByName,
  deleteRestaurantById,
};
