const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware

app.use(cors());

app.use(express.json());

// server checking

app.get("/", (req, res) => {
  res.send("server is run successfully");
});

app.listen(port, (req, res) => {
  console.log(`server port is ${port}`);
});
