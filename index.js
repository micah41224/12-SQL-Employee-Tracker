require('dotenv').config();
const dotEnv = require("dotenv").config();
const mysql = require("mysql2");
const CT =require("console.table");
const inquirer = require("inquirer");
const express = require("express");


const app = express();

const PORT = process.env.PORT || 3306;

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

function manageDB () {
  inquirer
  .prompt([
    {
      type: "list",
      message: "Please select a task",
      name: "mainMenu",
      choices: [
          "View All Departments", 
          "View all Roles", 
          "View All Employees", 
          "Add a Department", 
          "Add a Role", 
          "Add an Employee", 
          "Update an Employee Role", 
          "Exit" 
        ],
    }
]).then(userSelection => {
    switch (userSelection.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Quit":
                    console.log("Deactivating Employee Tracker.");
                    break;
                default:
                    console.log("Error occured with user selection.");
                    break;
}
})
;};

function viewAllDepartments() {
    db.query('SELECT * FROM department_table', (rows) => {
        console.table('\n', rows.slice(0));
        init();
      });
}

function viewAllRoles() {
    db.query('SELECT role_table.id, role_table.title, role_table.salary, department_table.department_name AS ', (rows) => {
        console.table('\n', rows.slice(0));
        init();
    });
}

function viewAllEmployees() {
    db.query('')
}

function addDepartment() {
    db.query('')
}

function addRole() {
    db.query('')
}

function addEmployee() {
    db.query('')
}