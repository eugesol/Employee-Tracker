USE employee_tracker;

INSERT INTO departments (dep_name)
VALUE ("Marketing"),
("Sales"),
("Accounting");

INSERT INTO roles (title, salary, dep_id)
VALUE ("Marketing Director", 80000.00, 1)
,("Sales Lead", 56000.00, 2)
,("Accountant", 45000.00, 3);