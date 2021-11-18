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
    db_create.query("SELECT department_table.id 'ID', department_table.department_name 'Department Name' FROM department_table", 
    function (err, res) {
        if (err) throw err;
        console.table(res);
        startUp();
      });
}


function viewAllRoles() {
    db_create.query(`SELECT role_table.id "ID", role_table.title "Title", role_table.salary "Salary", department_table.department_name "Department Name" FROM role_table JOIN department_table ON department_table.id = role_table.department_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        startUp();
      });
}


function viewAllEmployees() {
    db_create.query(`SELECT ee.id "ID", ee.first_name "First Name", ee.last_name "Last Name", r.title "Title", d.department_name "Department Name", r.salary "Salary",
CASE when em.first_name is null then '' else CONCAT(em.first_name, " ", em.last_name) end AS Manager from employee_table ee
LEFT JOIN employee_table em on ee.manager_id = em.id
LEFT JOIN role_table r ON r.id = ee.role_id
LEFT JOIN department_table d ON d.id = r.department_id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        startUp();
    });
}

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

    retrieveDepartments().then( ([rows, fields]) => {
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
    ]).then(function (userInput) {
        //console.log(userInput.departmentName);
        var sql = 'SELECT id FROM department_table WHERE department_name = ?';
        var name = userInput.departmentName;
        //console.log(name);
        db_create.query(sql, [name], function (err, result) {
        if (err) throw err;
            //console.log(result);
            const departmentId =result[0].id;
        db_create.query(`INSERT INTO role_table(title, salary, department_id) VALUES('${userInput.roleName}','${userInput.salaryAmount}', '${departmentId}')`, 
            function (err, res)  {
                if (err) throw err;
                console.log(`'${userInput.roleName}' has been added to the database`);
                startUp();
               });
            })            
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
    ]).then(function (userInput) {
        //console.log(userInput.title);
        var sql = 'SELECT id FROM role_table WHERE title = ?';
        var name = userInput.title;
        //console.log(name);
        db_create.query(sql, [name], function (err, result) {
            if (err) throw err;
            //console.log(result);
        const roleId = result[0].id;
        var sql = 'SELECT id FROM employee_table WHERE first_name = ? AND last_name = ?';
        var fname = userInput.managerName.split(' ')[0];
        var lname = userInput.managerName.split(' ')[1];
        //console.log('fname: '+ fname);
        //console.log('lname: '+ lname);
        db_create.query(sql, [fname,lname], function (err, result) {
            if (err) throw err;
            //console.log(result);
            const managerId = result[0].id;  
            db_create.query(`INSERT INTO employee_table(first_name, last_name, role_id, manager_id) VALUES('${userInput.firstName}','${userInput.lastName}', '${roleId}', '${managerId}')`, (result) => {
                console.log(`Added '${userInput.firstName}' '${userInput.lastName}' to the database`);
                startUp();
            });
        });        
    });
})}

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
    ]).then(function(userInput) {
//console.log(userInput.roleName);
var sql = 'SELECT id FROM role_table WHERE title = ?';
var role = userInput.roleName;
//console.log(role);
db_create.query(sql, [role], function(err, result) {
    if (err) throw err;
   //console.log(result);
        const roleId = result[0].id;
        
var sql = 'SELECT id FROM employee_table WHERE CONCAT(first_name, \' \', last_name) = ?';
var eName =userInput.employeeName;
//console.log(eName);
db_create.query(sql, [eName], function(err, result){
    if (err) throw err;
   // console.log(result);

            const employeeId = result[0].id;  

            db_create.query(`UPDATE employee_table SET role_id = ? WHERE id =?`, [roleId, employeeId], (result) => {
                console.log(`Updated the role of '${userInput.employeeName}' to '${userInput.roleName}' in the database`);
                startUp();
            });
        });        
    });
    })
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









