const express = require('express');
const mysql = require("mysql2");
const CT =require("console.table");
const inquirer = require("inquirer");
// const Connection = require("mysql2/typings/mysql/lib/Connection");
const env = require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3306;

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var db_create = mysql.createConnection({
    host: process.env.DB_HOST,
    port: PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
},
);

db_create.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // clear();
// Insert main function
});
