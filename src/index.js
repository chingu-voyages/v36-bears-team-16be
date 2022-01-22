const express = require("express");
const router = express.Router();

const app = express();

const port = 5000 || process.env.port;

app.get("/", (req, res) => {
  res.send("Hello Wolrd");
});

app.listen(5000, () => {
  console.log(`Backend is running on port ${port}`);
});
