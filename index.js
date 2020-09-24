const mysql = require("mysql");
const inquirer = require("inquirer");
const boxen = require("boxen");

let employeeProfile;

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "employee_tracker",
});

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    starter();
});

function starter() {
    console.log(
        boxen("Employee Tracker", {
            padding: 3,
            margin: 3,
            borderStyle: "double",
        })
    );
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
                    "Exit",
                ],
            },
        ])
        .then((answer) => {
            switch (answer.mainMenu) {
                case "Add a new department":
                    addDepartment();
                    break;
                case "Add a new role":
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
                case "Update an employees Role":
                    updateEmployee();
                    break;

                case "Exit":
                    console.log("Goodbye!");
                    connection.end();
                    break;
            }
        });
}
