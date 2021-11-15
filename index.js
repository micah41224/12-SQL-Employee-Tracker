require('dotenv').config();
const dotEnv = require("dotenv").config();
const mysql = require("mysql2");
const CT =require("console.table");
const inquirer = require("inquirer");
const express = require("express");


const app = express();

const PORT = process.env.PORT || 3306;

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

db_create.connect((err) => {
    if (err){
         throw err;
    }
    console.log('Mysql Connected');
    // console.log("connected as id " + connection.threadId + "\n");
    // clear();
// Insert main function
});

function manageCompany () {
  inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'mainMenu',
      choices: [
          'View All Departments', 
          'View all Roles', 
          'View All Employees', 
          'Add a Department', 
          'Add a Role', 
          'Add an Employee', 
          'Update an Employee Role', 
          'Exit' 
        ]}
]);}