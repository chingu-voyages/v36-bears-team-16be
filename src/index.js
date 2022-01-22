const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { NotFoundError } = require("./expressError");
const router = express.Router();

const app = express();

const port = process.env.port || 5000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Wolrd");
});

// If no endpoint matches
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// Handle error output
app.use(function (err, req, res, next) {
  // handle validationError
  if (err.name === "ValidationError") {
    let errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({ error: errors });
  }
  // handle normal error
  else {
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
      error: message,
    });
  }
});

app.listen(5000, () => {
  console.log(`Backend is running on port ${port}`);
});
