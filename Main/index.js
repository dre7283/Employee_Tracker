const { prompt } = require("inquirer"); 
const display = require("asciiart-display");
const db = require("./db");
// const { viewDepartmentBudgets } = require("./db");
// const { allowedNodeEnvironmentFlags } = require("process");
require("console.table");

init ();

// Show display text and load main prompts
function init () {
    const displayText = display({name: "Employee Tracker"}).render();

    console.log(displayText);

    loadMainPrompts();
}

function loadMainPrompts () {
    prompt([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "View Department Salary Budge",
                    value: "VIEW_DEPARTMENT_SALARY_BUDGET"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ]).then (res => {
        let choice =res.choice;
        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            case "VIEW_DEPARTMENT_SALARY_BUDGET":
                viewDepartmentSalaryBudget();
                break;
            case "VIEW ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            default:
                quit();
        }
    }
    )
}

// View all employees
function viewEmployees() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
    })
    .then(() => loadMainPrompts());
}

// View all the employees that belong to a specific department
function viewEmployeesBYDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({id, name}) => ({
                name: name,
                value: id
        })); 

        prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to review employees?",
                choices:departmentChoices
            }
        ])
        .then(res => db.findAllEmployeesByDepartment (res.departmentId))
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadMainPrompts())
    });
}

// View employees that have a specific manager
function viewEmployeesByManager() {
    db.findAllEmployees ()
        .then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({id, first_name, last_name}) =>({
                name: `${first_name} - ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "managerId",
                    message: "View employees by manager", 
                    choices: managerChoices
                }
            ])
            .then(res => db.findAllEmployeesByManager(res.managerId))
            .then(([rows])=> {
                let employees = rows;
                console.log("\n");
                if (employees.length === 0) {
                    console.log("The selected employees has no direct reports");
                } else {
                    console.table(employees);
                }
            })
            .then(() => loadMainPrompts())
        });
}
// Delete an employee
function removeEmployee(){
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee should be deleted?",
                choices: employeeChoices
            }
        ])
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log ("Employee has been removed from the database"))
        .then(() => loadMainPrompts())
    })
}

// Update employee's role
function updateEmployeeRole(){
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name}) => ({
                name: `${first_name} - ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which role should be updated?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.findAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const roleChoices = roles.map(({ id, title}) => ({
                                name: title,
                                value: id
                        }));

                        prompt([
                            {
                                type: " list",
                                name: "roleId",
                                message: " Which role should be assigned to the selected employee?",
                                choices: roleChoices
                            }
                        ])
                            .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                            .then(() => console.log("Updated employee's role"))
                            .then(() => loadMainPrompts())
                    });
                });
        })
}

// Update the employee's manager
function updateEmployeeManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} - ${last_name}`,
                value: id
        }));

        prompt([
            {
                type: "list", 
                name: "employeeId", 
                message: " Which employee's manager should be updated?", 
                choices: employeeChoices
            }
        ])
            .then(res => {
                let employeeId = res.employeeId
                db.findAllPossibleManagers(employeeId)
                    .then(([rows]) =>{
                        let managers = rows;
                        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            VALUE: id
                    }));

                    prompt([
                        {
                            type: "list",
                            name: "managerId",
                            message: " Who is the manager for this employee",
                            choices: managerChoices 
                        }
                    ])
                    .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                    .then(() => console.log("Updated employee's manager"))
                    .then(() => loadMainPrompts())
            })
        })
    })
}

// View all the roles
function viewRoles() {
    db.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
    })
    .then(() => loadMainPrompts());
}

// Add a role
function addRole() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt ([
                {
                    name: " title",
                    message: " Provide the role title"
                },
                {
                    name: "salary",
                    message: " What is the salary for this role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "What department should this role be assigned to?",
                    choices: departmentChoices
                }
            ])
                .then(role => {
                    db.createRole(role)
                        .then(() => console.log(`${role.title} added to the database`))
                        .then(() => loadMainPrompts())
                })
        })
}

// Delete a role
function removeRole(){
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({id, title}) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "roleId",
                    message: "Which role do you want to delete? (WARNING: If you delete the role you delete the employees)",
                    choices: roleChoices
                }
            ])
                .then(res => db.removeRole(res.roleId))
                .then(() => console.log(`${role.tile} deleted from database`))
                .then(() => loadMainPrompts())
        })
}

// View all departments
function viewDepartments () {
    db.findAllDepartments ()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => loadMainPrompts());
}

// Add a department
function addDepartment(){
    prompt([
        {
            name: "name",
            message: "What is the name of this department?"
        }
    ])
        .then(res => {
            let name = res;
            db.createDepartment(name)
                .then(() => console.log(`${name.name} added to the database`))
                .then(() => loadMainPrompts())
        })
}

// Delete a department
function removeDepartment(){
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name}) => ({
                name: name,
                value: id
            }));

            prompt({
                type: "list",
                name: "departmentId",
                message: "Which department should be deleted? (WARNING: If you delete the department the roles and employees associate will be deleted)",
                choices: departmentChoices
            })
                .then(res => db.removeDepartment(res.departmentId))
                .then(() => console.log(`${name.name} deleted from the database`))
                .then(() => loadMainPrompts())
        })
}

// View all departments and their salaries
function viewDepartmentSalaryBudget(){
    db.viewDepartmentBudgets()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => loadMainPrompts());
}

// Add an employee
function addEmployee(){
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
        .then(res =>{
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title}) => ({
                        name: title,
                        value:id
                    }));

                    prompt({
                        type: "list",
                        name: "roleId",
                        message: "What is the employee's role?",
                        choices: roleChoices
                    })
                        .then(res => {
                            let roleId = res.roleId;

                            db.findAllEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
                                    const managerChoices = employees.map(({ id, first_name, last_name}) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                }));

                                managerChoices.unshift({ name: "None", value: null });

                                prompt({
                                    type: "list",
                                    name: "managerId",
                                    message: "Who is the employee's manager?",
                                    choices: managerChoices
                                })
                                    .then(res => {
                                        let employee = {
                                            manager_id: res.managerId,
                                            role_id: roleId,
                                            first_name: firstName,
                                            last_name: lastName
                                        }

                                        db.createEmployee(employee);
                                    })
                                    .then(() => console.log(
                                        `${firstName} ${lastName} added to the database`
                                    ))
                                    .then(() => loadMainPrompts())
                            })
                        })
                })
        })
}

// Quit App
function quit() {
    console.log("All Tasks complete.  Goodbye!")
    process.exit();
}