const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  // Find all employees and join with roles and departments tables to display the employees roles, salaries, departments, and managers
  findAllEmployees() {
    return this.connection.promise().query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
  }
  // Find all employee except a certain id employee id
  findAllPossibleManagers(employeeId) {
    return this.connection
      .promise()
      .query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?",
        employeeId
      );
  }

  // create a new employee
  createEmployee(employee) {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET?", employee);
  }

  // delete the employee based on a certain employee id
  removeEmployee(employeeId) {
    return this.connection
      .promise()
      .query("DELETE FROM employee WHERE id = ?", employeeId);
  }

  // Update the employee's role based on a certain id
  updateEmployeeRole(employeeId, roleId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
        roleId,
        employeeId,
      ]);
  }

  // Update the employee's manager based on a certain id
  updateEmployeeManager(employeeId, managerId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET manager_id = ? WHERE id = ?", [
        managerId,
        employeeId,
      ]);
  }

  // Find all roles and join with the departments to display department name
  findAllRoles() {
    return this.connection
      .promise()
      .query(
        "SELECT role.id, role.title, department.name AD department, role.salary FROM role LEFT JOIN department on role. department_id = department.id;"
      );
  }

  // Create a new role
  crateRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  }

  // Find all departments
  findAllDepartments() {
    return this.connection
      .promise()
      .query("SELECT department.id, department.name FROM department;");
  }

  // Find all the departments and join with employees and roles then sum up to get department budget
  viewDepartmentBudgets() {
    return this.connection
      .promise()
      .query(
        "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role. department_id = department.id GROUP BY department.id, department.name;"
      );
  }

  // Create a new department
  createDepartment(department) {
    return this.connection
      .promise()
      .query("INSERT INTO department SET ?", department);
  }

  // Delete a department
  removeDepartment(departmentId) {
    return this.connection
      .promise()
      .query("DELETE FROM department WHERE id = ?", departmentId);
  }

  // Find all the employees in a specified department and join with the roles table to display role titles
  findAllEmployeesByDepartment(departmentId) {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id = ?;",
        departmentId
      );
  }

  // File all the employees by their manager and join with department and roles tables to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
        managerId
      );
  }
}

module.exports = new DB(connection);
