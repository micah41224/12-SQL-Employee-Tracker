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
  inquirer.prompt([
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
    db.query(`SELECT * FROM department_table`, (rows) => {
        console.table('\n', rows.slice(0));
        init();
      });
}

function viewAllRoles() {
    // Combined w3schools examples to frame this, needs checking
    db.query(`SELECT role_table.id, role_table.title, role_table.salary, department_table.department_name FROM roles JOIN department_table ON department_table.id = roles.department_id`, (rows) => {
        console.table('\n', rows.slice(0));
        init();
    });
}

function viewAllEmployees() {
    db.query(`SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.department_name, role_table.salary, CONCAT(employee_table.first_name, " ", employee_table.last_name) AS Manager FROM employee_table LEFT JOIN role_table ON role_table.id = employee_table.role_id LEFT JOIN department_table ON department_table.id = role_table.department_id`)
}

function addDepartment() {
    inquirer.prompt([
        {
            name:"department_Name",
            type:"input",
            message:"What is the department name?"
        }
    ]).then(userInput => {
        db.query(`INSERT INTO department_table(department_name) VALUES("${userInput.department_name}")`), (result) => {
            console.log('"${userInput.department_name}" was added to the database');
        }
    })
    
}


function addRole() {
    inquirer.prompt([
        {
            name:"roleName",
            type:"input",
            message:"What is this role called?"
        },
        {
            name:"salaryAmount",
            type:"input",
            message:"What is the salary for this role?"
        },
        {
            name:"departmentName",
            type:"list",
            message:"What department does this role fall under?",
            // choices:
        }
    ])
    db.query(``)
}

function addEmployee() {
    db.query(``)
}


