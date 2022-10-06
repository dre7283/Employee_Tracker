use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Operations'),
    ('Finance'),
    ('Warehouse');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Branch Manager', 200000, 1),
    ('Salesperson', 140000, 1),
    ('Assistant to the Regional Manager', 140000, 1),
    ('Head of Accounting', 120000, 3),
    ('Accountant', 90000, 3),
    ('Supplier Relations', 80000, 2),
    ('Warehouse Foreman', 135000, 4),
    ('Warehouse',60000, 4),
    ('Quality Assurance', 70000, 2),  
    ('Office Administrator', 100000, 2),
    ('Human Resources', 50000, 2),
    ('Customer Service Specialist', 65000, 2);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Michael', 'Scott', 1, NULL),
    ('Jim', 'Halpert', 2, 1),
    ('Dwight', 'Schrute', 3, 1),
    ('Angela', 'Martin', 4, 1),
    ('Oscar', 'Martinez', 5, 4),
    ('Meridith', 'Palmer', 6, 1),
    ('Darryll', 'Philbin', 7, NULL),
    ('Val', 'Johnson', 8, 7),
    ('Creed', 'Bratton', 9, 1),
    ('Pam', 'Beesley', 10, 1),
    ('Toby', 'Flenderson', 11, NULL),
    ('Kelly', 'Kapoor', 12, 1);


