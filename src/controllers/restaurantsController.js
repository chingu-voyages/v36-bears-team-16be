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

module.exports = {
  getRestaurantByOwnerId,
};
