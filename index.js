const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const connetion = mongoose.connection;
connetion.once("open", () => {
  console.log("Connected to MongoDB");
});
// Router
const authrouter = require("./routes/auth");
app.use("/api/user", authrouter);

// Connect to MongoDB
const DB = process.env.DB_Database;
const localhost = process.env.DB_HOST;
async function start() {
  try {
    app.listen(localhost || 5000, () =>
      console.log(`Server running ${localhost} port`)
    );

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}


start();
