const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  host: "postgres",
  user: "postgres",
  password: "postgres",
  database: "usersdb",
  port: 5432
});

app.get("/api/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  await pool.query("INSERT INTO users(name,email) VALUES($1,$2)", [name,email]);
  res.send("User added");
});

app.listen(5000,"0.0.0.0", () => 
  console.log("Backend running on port 5000")
);