require('dotenv').config();
const dotEnv = require("dotenv").config();
const mysql = require("mysql2");
const consoleTable =require("console.table");
const inquirer = require("inquirer");


const PORT = process.env.PORT || 3306;


var db_create = mysql.createConnection({
    host: process.env.DB_HOST,
    port: PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
},

// const db_create = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "mysql5200",
//     database: "employee_db",
//     connectTimeout: 300000
// },

console.log("It worked")
);

db_create.connect((err) => {
    if (err){
         throw err;
    }
    console.log('Mysql Connected');
    startUp();
});


function startUp(db_create) {
  inquirer.prompt([
    {
      type: 'list',
      message: 'Please select a task',
      name: 'options',
      choices: [
          'View all departments', 
          'View all roles', 
          'View all employees', 
          'Add a department', 
          'Add a role', 
          'Add an employee', 
          'Update an employee role', 
          'Exit' 
        ]
    }
]).then(function (data) {
    switch (data.options) {
                case ('View all departments'):
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case "Exit":
                    console.log('Deactivating Employee Tracker.');
                    break;
                default:
                    console.log(data+'/n'+'Error occured with user selection.');
                    break;
}
});
};

function viewAllDepartments() {
    db_create.query("SELECT * FROM department_table", 
    function (err, res) {
        if (err) throw err;
        console.table(res);
        startUp();
      });
}


function viewAllRoles() {
    db_create.query(`SELECT role_table.id, role_table.title, role_table.salary, department_table.department_name FROM role_table JOIN department_table ON department_table.id = role_table.department_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        startUp();
      });
}


// function viewAllEmployees() {
//     db_create.query(`SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.department_name, role_table.salary, employee_table.manager_id as manager_id FROM employee_table LEFT JOIN role_table ON role_table.id = employee_table.role_id LEFT JOIN department_table ON department_table.id = role_table.department_id`, function (err, res) {
//         if (err) throw err;
//         console.table(res);
//         startUp();
//     });
// }

// VERSION 3
function viewAllEmployees() {
    db_create.query(`SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.department_name, role_table.salary, CONCAT(employee_table.manager_id, " ", employee_table.first_name, " ", employee_table.last_name) AS Manager FROM employee_table LEFT JOIN role_table ON role_table.id = employee_table.role_id LEFT JOIN department_table ON department_table.id = role_table.department_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        startUp();
    });
}

// VERSION 1
// function viewAllEmployees() {
//     db_create.query(`SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.department_name, role_table.salary, CONCAT(employee_table.first_name, " ", employee_table.last_name) AS Manager FROM employee_table LEFT JOIN role_table ON role_table.id = employee_table.role_id LEFT JOIN department_table ON department_table.id = role_table.department_id`, function (err, res) {
//         if (err) throw err;
//         console.table(res);
//         startUp();
//     });
// }

function addDepartment() {
    inquirer.prompt([
        {
            name:"department_Name",
            type:"input",
            message:"What is the department name?"
        }
    ]).then(userInput => {
        db_create.query(`INSERT INTO department_table(department_name) VALUES("${userInput.department_Name}")`, function (err, res) {
            if (err) throw err;
            console.log(`"${userInput.department_Name}" was added to the database`);
            startUp();
        });
    })
    
}


function addRole() {

    getDepartments().then( ([rows, fields]) => {
         const dptList = rows.map(({ id, department_name }) => ({ name: department_name}));
    
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
            choices: dptList,
        }
    ]).then(userInput => {
        db_create.query(`SELECT id FROM department_table WHERE department_name = ('${userInput.departmentName})')`), (result) => {
            const departmentId =result[0].id;
            db_create.query(`INSERT INTO role_table(title, salary, department_id) VALUES('${userInput.roleName}','${userInput.salaryAmount}', '${departmentId}')`, (result) => {
                console.log(`'${userInput.roleName}' has been added to the database`);
                startUp();
               });
            };            
        });        
    })    
}


async function addEmployee() {
    
    const managerList = await retrieveManagers();
    const choicesManagerList = managerList[0].map(({ manager_name }) => ({ name: manager_name}));
    const departmentList = await retrieveDepartments();
    const choicesDepartmentList = departmentList[0].map(({ department_name }) => ({ name: department_name}));
    const roleList = await retrieveRoles();    
    const choicesRoleList = roleList[0].map(({ title }) => ({ name: title}));
        
    const userInput = await inquirer
    .prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the first name of the employee?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the last name of the employee?",
        },
        {
            type: "list",
            name: "title",
            message: "What is the title of the employee?",
            choices: choicesRoleList,
        },
        {
            type: "list",
            name: "departmentName",
            message: "Which department should the employee belong to?",
            choices: choicesDepartmentList,
        },        
        {
            type: "list",
            name: "managerName",
            message: "Which manager should the employee be assigned?",
            choices: choicesManagerList,
        },
    ]);

    db_create.query(`SELECT id FROM role_table WHERE title = ('${userInput.title}')`, (result) => {
        const roleId = result[0].id;
        
        db_create.query(`SELECT id FROM employee_table WHERE first_name = ('${userInput.managerName.split(' ')[0]}') AND last_name = ('${userInput.managerName.split(' ')[1]}')`, (result) => {
            const managerId = result[0].id;  
            db_create.query(`INSERT INTO employee_table(first_name, last_name, role_id, manager_id) VALUES('${userInput.firstName}','${userInput.lastName}', '${roleId}', '${managerId}')`, (result) => {
                console.log(`Added '${userInput.firstName}' '${userInput.lastName}' to the database`);
                startUp();
            });
        });        
    });
}

async function updateEmployeeRole() {
    const employeeList = await retrieveEmployees();
    const choicesEmployeeList = employeeList[0].map(({ employee_name }) => ({ name: employee_name}));
    const roleList = await retrieveRoles();    
    const choicesRoleList = roleList[0].map(({ title }) => ({ name: title}));

    const userInput = await inquirer
    .prompt([
        {
            type: "list",
            name: "employeeName",
            message: "Which employee's role do you want to update?",
            choices: choicesEmployeeList,
        },
        {
            type: "list",
            name: "roleName",
            message: "Which role do you want to assign the selected employee?",
            choices: choicesRoleList,
        },        
    ]);

    db_create.query(`SELECT id FROM role_table WHERE title = ('${userInput.roleName}')`, (result) => {
        const roleId = result[0].id;
        
        db_create.query(`SELECT id FROM employee_table WHERE CONCAT(first_name, ' ', last_name) = ('${userInput.employeeName}')`, (result) => {
            const employeeId = result[0].id;  

            db_create.query(`UPDATE employee_table SET role_id = ? WHERE id =?`, [roleId, employeeId], (result) => {
                console.log(`Updated the role of '${userInput.employeeName}' to '${userInput.roleName}' in the database`);
                startUp();
            });
        });        
    });
}

function retrieveManagers() {
    return db_create.promise().query(`SELECT CONCAT(first_name,' ', last_name) AS manager_name FROM employee_table WHERE manager_id IS NULL`);
}

function retrieveDepartments() {
    return db_create.promise().query(`SELECT department_name FROM department_table`);
}

function retrieveEmployees() {
    return db_create.promise().query(`SELECT CONCAT(first_name,' ',last_name) "employee_name" FROM employee_table`);
}

function retrieveRoles() {
    return db_create.promise().query(`SELECT title FROM role_table`);
}

//startUp();









