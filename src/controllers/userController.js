require("dotenv").config();

const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id", (error, results) => {
    if (error) {
      response.status(500).send(error.toString());
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(500).send(error.toString());
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const createUser = (request, response) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    is_owner,
    phone,
    street_address,
    zip_code,
    country_code,
  } = request.body;

  pool.query(
    `INSERT INTO users (username, password, first_name, last_name, email, is_owner, street_address, zip_code, country_code, phone)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning *`,
    [username, password, first_name, last_name, email, is_owner, street_address, zip_code, country_code, phone],
    (error, results) => {
      if (error) {
        response.send(error.toString());
      } else {
        response
          .status(201)
          .json(`Inserted new user with ID: ${results.rows[0].id}`);
      }
    });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    is_owner,
    street_address,
    zip_code,
    country_code,
    phone,
  } = request.body;

  pool.query(
    `UPDATE users
     SET username = $1, password = $2, first_name = $3,
     last_name = $4, email = $5, is_owner = $6, street_address = $7, zip_code = $8, country_code = $9, phone = $10
     WHERE id = $11`,
    [
      username,
      password,
      first_name,
      last_name,
      email,
      is_owner,
      street_address,
      zip_code,
      country_code,
      phone,
      id,
    ],
    (error, results) => {
      if (error) {
        response.status(500).send(error.toString());
      } else {
        response.status(200).send(`Modified user with ID: ${id}`);
      }
    });
};

const deleteUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(500).send(error.toString());
    } else {
      response.status(200).send(`User deleted with ID: ${id}`);
    }
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
};
