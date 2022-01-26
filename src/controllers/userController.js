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
    address_id,
    phone,
    street,
    city,
    state,
    country,
    zip_code,
  } = request.body;

  pool.query(
    `WITH new_address_row AS (
      INSERT INTO addresses(street, city, state, country, zip_code)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
    )
    INSERT INTO users (username, password, first_name, last_name, email, is_owner, address_id, phone)
    VALUES
      ($6, $7, $8, $9, $10, $11, (SELECT id FROM new_address_row), $12)
    returning *`,
    [street, city, state, country, zip_code, username, password, first_name, last_name, email, is_owner, phone],
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
    address_id,
    phone,
  } = request.body;

  pool.query(
    `UPDATE users
     SET username = $1, password = $2, first_name = $3,
     last_name = $4, email = $5, is_owner = $6, address_id = $7, phone = $8
     WHERE id = $9`,
    [
      username,
      password,
      first_name,
      last_name,
      email,
      is_owner,
      address_id,
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
