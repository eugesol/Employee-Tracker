const connection = require("./config/connection");
const inquirer = require("inquirer");
const boxen = require("boxen");

let employeeProfile;

starter();
let depArr = ["Marketing", "Sales", "Accounting"];

function starter() {
    console.log(
        boxen("Employee Tracker", {
            padding: 3,
            margin: 3,
            borderStyle: "double",
        })
    );
    console.log("\n\n\n")
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
                    depArr.push(answer.newDep);
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
                type: "list",
                message: "Enter the ID of the department this role will fall under",
                name: "department",
                choices: depArr
            },
        ])
        .then((answers) => {
            connection.query(
                `INSERT INTO roles (title, salary, dep_id)
                VALUES (?, ?, ?)`,
                [
                    answers.roleTitle,
                    answers.roleSalary,
                    (depArr.indexOf(answers.department) +1),
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
                message: "Enter Employee ID:",
                name: "id",
            },
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
                message: "What is the new employees role Id?",
                name: "role",
            },
            {
                type: "input",
                message: "What is the new employees manager Id?",
                name: "manager",
            },
        ])
        .then((answers) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    id: answers.id,
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.role,
                    manager_id: answers.manager,
                },
                function (err, results) {
                    if (err) throw err;
                    console.log(results.affectedRows + " employee inserted! \n");
                    more();
                }
            );
        });
}




function allDepartments() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        console.log("\n Here are all current Departments. \n");
        console.table(results);
        more();
    });
}
function rolesTable() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        console.log("\n Here are all current Roles");
        console.table(results);
        more();
    });
}
function viewAll() {
    console.log("Viewing all employees:\n");
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        else {
            // Log all results of the SELECT statement
            console.table(results);
            more();
        }
    });
}

function updateEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        employeeProfile = results;
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which employee would you like to update?",
                    name: "employee",
                    choices: results.map(
                        (result) =>
                            result.first_name + " " + result.last_name + " " + result.role_id
                    ),
                },
            ])
            .then((answer) => {
                let employeeInfo = answer.employee.split(" ");
                connection.query("SELECT * FROM role", function (err, res) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message:
                                    "What role would you like to select for this employee?",
                                name: "updatedRole",
                                choices: res.map((res) => res.id + " " + res.title),
                            },
                        ])
                        .then((newRole) => {
                            let roleId = newRole.updatedRole.split(" ")[0];
                            connection.query(
                                "UPDATE employee SET role_id = ?",
                                [roleId, employeeInfo[2]],
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("Role has been updated! \n ");
                                    more();
                                }
                            );
                        });
                });
            });
    });
}