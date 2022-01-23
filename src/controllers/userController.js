require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const {
    username,
    password,
    email,
    is_owner,
    user_address,
    whatsapp,
    user_phone,
  } = request.body;

  pool.query(
    "INSERT INTO users (username, password,email,is_owner,user_address,whatsapp,user_phone) VALUES ($1, $2,$3, $4, $5, $6, $7)",
    [username, password, email, is_owner, user_address, whatsapp, user_phone],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
  pool.query(
    "SELECT * FROM users ORDER BY ID DESC LIMIT 1",
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .json(`Inserted new user with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    username,
    password,
    email,
    is_owner,
    user_address,
    whatsapp,
    user_phone,
  } = request.body;

  pool.query(
    "UPDATE users SET username = $1, password = $2, email = $3, is_owner = $4,user_address = $5, whatsapp = $6, user_phone = $7 WHERE id = $8",
    [
      username,
      password,
      email,
      is_owner,
      user_address,
      whatsapp,
      user_phone,
      id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Modified user with ID: ${id}`);
    }
  );
};

const deleteUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
};
