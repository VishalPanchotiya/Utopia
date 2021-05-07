const express = require("express");
const path = require("path");
var indexroutes = require("./routes");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Utopia");
const bodyParser = require("body-parser");
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'userdetails',
    resave: false,
    saveUninitialized: true
}));

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexroutes);

app.listen(3001, () => console.log("App listening on port 3001!"));
