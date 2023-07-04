const express = require("express");
const mongoose = require("mongoose");
const database = require("./database");
const dbFunctions = require("./dbFunctions");
const { Client } = require("@googlemaps/google-maps-services-js");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

// Middleware
const corsOptions = {
  origin: "https://pawsfind.onrender.com", // Frontend URI (ReactJS)
};
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to Backend!" });
});

app.get("/api/pets", async (req, res) => {
  try {
    const docs = await dbFunctions.getAllDocs();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

app.post("/api/addpet", async (req, res) => {
  let data = req.body;

  try {
    data = await dbFunctions.addDoc(data);
    res.json(data);
  } catch (err) {
    console.error("# Post Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});

let server;
let conn;

(async () => {
  try {
    conn = await database();
    await dbFunctions.getDb(conn);
    const PORT = process.env.PORT;
    server = app.listen(PORT, () => {
      console.log(`App is listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("# Error:", err);
    console.error("# Exiting the application.");
    await closing();
    process.exit(1);
  }
})();

async function closing() {
  console.log("# Closing resources...");
  if (conn) {
    await conn.close();
    console.log("# Database connection closed.");
  }
  if (server) {
    server.close(() => console.log("# Web server stopped."));
  }
}
