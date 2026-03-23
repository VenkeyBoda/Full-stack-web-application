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

/* =========================
   Health Check (K8s Ready)
========================= */

app.get("/health",(req,res)=>{

res.status(200).send("OK");

});

/* =========================
   Get Users
========================= */

app.get("/api/users", async (req, res) => {

try{

const result = await pool.query(
"SELECT * FROM users ORDER BY id DESC"
);

res.json(result.rows);

}
catch(err){

console.error(err);

res.status(500).send("Server error");

}

});

/* =========================
   Add User
========================= */

app.post("/api/users", async (req, res) => {

try{

const { name, email } = req.body;

if(!name || !email){

return res.status(400).send(
"Missing fields"
);

}

try{

  await pool.query(
  "INSERT INTO users(name,email) VALUES($1,$2)",
  [name,email]
  );
  
  }
  catch{
  
  return res.status(400).send(
  "Email already exists"
  );
  
  }

res.status(201).send(
"User added"
);

}
catch(err){

console.error(err);

res.status(500).send(
"Insert failed"
);

}

});

/* =========================
   Delete User
========================= */

app.delete("/api/users/:id", async (req,res)=>{

try{

const id=req.params.id;

await pool.query(

"DELETE FROM users WHERE id=$1",

[id]

);

res.send("User deleted");

}
catch(err){

console.error(err);

res.status(500).send(
"Delete failed"
);

}

});

/* =========================
   Start Server
========================= */

app.listen(5000,"0.0.0.0",()=>{

console.log(
"Backend running port 5000"
);

});