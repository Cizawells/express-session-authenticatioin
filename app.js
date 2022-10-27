const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var routes = require("./routes");
// const connection = require("./config/database");

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo")(session);

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
var app = express();

const dbString = "mongodb://localhost:27017/tutorialdb";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const connection = mongoose
  .createConnection(dbString, dbOptions)
  .once("connection", () => {
    console.log("connected");
  });

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, ///equals 1 day
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

// TODO

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

app.get("/", (req, res, next) => {
  res.send(`<h1>Hello world (Sessions)</h1>`);
});

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);
