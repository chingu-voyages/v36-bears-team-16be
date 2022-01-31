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

const getRestaurantByOwnerId = (req, res) => {
  const ownerId = parseInt(req.params.ownerId);
  pool.query(
    "SELECT * FROM restaurants WHERE owner_id = $1",
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

const createRestaurant = (req, res) => {
  const {
    name,
    phone,
    hours,
    delivery,
    owner_id,
    irl_payment_only,
    street_address,
    zip_code,
    country_code,
  } = req.body;

  pool.query(
    "INSERT INTO restaurants (name,phone,hours,delivery,owner_id,irl_payment_only,street_address,zip_code,country_code) VALUES ($1, $2,$3, $4, $5, $6, $7,$8,$9) RETURNING id",
    [
      name,
      phone,
      hours,
      delivery,
      owner_id,
      irl_payment_only,
      street_address,
      zip_code,
      country_code,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(200)
        .json(`Inserted new restaurant with ID: ${results.rows[0].id}`);
    }
  );
};

const updateRestaurant = (req, res) => {
  const restaurantId = parseInt(req.params.restaurantId);
  const {
    name,
    phone,
    hours,
    delivery,
    owner_id,
    irl_payment_only,
    street_address,
    zip_code,
    country_code,
  } = req.body;

  pool.query(
    "UPDATE restaurants SET name = $1, phone = $2, hours = $3, delivery = $4,owner_id = $5, irl_payment_only = $6, street_address = $7, zip_code = $8, country_code = $9 WHERE id = $10",
    [
      name,
      phone,
      hours,
      delivery,
      owner_id,
      irl_payment_only,
      street_address,
      zip_code,
      country_code,
      restaurantId,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Modified restaurant with ID: ${restaurantId}`);
    }
  );
};

const deleteRestaurantById = (req, res) => {
  const restaurantId = parseInt(req.params.restaurantId);
  pool.query(
    "DELETE FROM restaurants WHERE id = $1",
    [restaurantId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Restaurant deleted with ID: ${restaurantId}`);
    }
  );
};

module.exports = {
  getRestaurantByOwnerId,
  getRestaurantByName,
  createRestaurant,
  deleteRestaurantById,
  updateRestaurant,
};
