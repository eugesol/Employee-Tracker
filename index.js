const connection = require("./config/connection");
const inquirer = require("inquirer");
const boxen = require("boxen");

let employeeProfile;

starter();
let depArr = [];
let roleArr = ["Marketing Director", "Sales Lead", "Accountant"];

function starter() {
    console.log(
        boxen("Employee Tracker", {
            padding: 3,
            margin: 3,
            borderStyle: "double",
        })
    );
    console.log("\n\n")
    mainMenu();
}

function mainMenu() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "How can I help?",
                name: "mainMenu",
                choices: [
                    "Add a new department",
                    "Add a new Role",
                    "Add a new employee",
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Update an employees role",
                    "Delete an employee",
                    "Exit",
                ],
            },
        ])
        .then((answer) => {
            switch (answer.mainMenu) {
                case "Add a new department":
                    addDepartment();
                    break;
                case "Add a new Role":
                    addRole();
                    break;
                case "Add a new employee":
                    addEmployee();
                    break;
                case "View all departments":
                    allDepartments();
                    break;
                case "View all roles":
                    rolesTable();
                    break;
                case "View all employees":
                    viewAll();
                    break;
                case "Update an employees role":
                    updateEmployee();
                    break;
                case "Delete an employee":
                    deleteEmployee();
                    break;
                case "Exit":
                    console.log("Goodbye!");
                    connection.end();
                    break;
            }
        });
}

function more() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Did you want to do anything else?",
                name: "addMore",
            },
        ])
        .then((answer) => {
            if (answer.addMore === true) {
                mainMenu();
            } else {
                console.log("Goodbye!");
                connection.end();
            }
        });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the Title of the new department?",
                name: "newDep",
            },
        ])
        .then((answer) => {
            connection.query(
                `INSERT INTO departments (dep_name)
            VALUES (?)`,
                [answer.newDep],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " department inserted! \n");
                    more();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the title of the new Role?",
                name: "roleTitle",
            },
            {
                type: "input",
                message: "What is the salary for this role?",
                name: "roleSalary",
            },
            {
                type: "input",
                message: "What department ID does this role fall under?",
                name: "dep_id",

            },
        ])
        .then((answers) => {
            connection.query(
                `INSERT INTO roles (title, salary, dep_id)
                VALUES (?, ?, ?)`,
                [
                    answers.roleTitle,
                    answers.roleSalary,
                    answers.dep_id,
                ],
                function (err, results) {
                    if (err) throw err;
                    console.log(results.affectedRows + " role inserted! \n");
                    more();
                }
            );
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the new employees first name?",
                name: "firstName",
            },
            {
                type: "input",
                message: "What is the new employees last name?",
                name: "lastName",
            },
            {
                type: "input",
                message: "What role ID does this employee fall under?",
                name: "role_id",
            },
        ])
        .then((answers) => {
            connection.query(
                `INSERT INTO employees (first_name, last_name, role_id)
                VALUES (?, ?, ?)`,
                [

                    answers.firstName,
                    answers.lastName,
                    answers.role_id,
                ],
                function (err, results) {
                    if (err) throw err;
                    console.log(results.affectedRows + " employee inserted! \n");
                    more();
                }
            );
        });
}




function allDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        console.log("\n Here are all current Departments. \n");
        console.table(results);
        more();
    });
}
function rolesTable() {
    connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;
        console.log("\n Here are all current Roles");
        console.table(results);
        more();
    });
}
function viewAll() {
    console.log("Viewing all employees:\n");
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;
        else {
            // Log all results of the SELECT statement
            console.table(results);
            more();
        }
    });
}
function updateEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employees ID number?",
                name: "emp_id",
            },
            {
                type: "input",
                message: "What is the new role ID",
                name: "newRole",
            },
        ])
        .then((answers) => {
            connection.query(
                `UPDATE employees SET role_id = ? where id = ?`,
                [

                    answers.newRole,
                    answers.emp_id,
                ],
                function (err, results) {
                    if (err) throw err;
                    console.log(results.affectedRows + " employee role updated! \n");
                    more();
                }
            );
        });
}
function deleteEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employees ID number?",
                name: "emp_id",
            },
        ])
        .then((answers) => {
            connection.query(
                `DELETE FROM employees where id = ?`,
                [

                    answers.emp_id,
                ],
                function (err, results) {
                    if (err) throw err;
                    console.log(results.affectedRows + " employee has been deleted! \n");
                    more();
                }
            );
        });
}
