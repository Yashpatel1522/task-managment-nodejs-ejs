const database = require("../../helpers/database.helper");
const logger = require("../../logger/logger");
var db = new database();

exports.employeepage = (request, response) => {
    try {
        response.render('./adminmodule/employees')
    } catch (error) {
        logger.error("Employee page is not render !")
    }
}


exports.adminEmployees = async (request, response) => {
    try {
        let employeeData = await db.executeQuery(`select users.* from users left join roles on users.role_id = roles.id where role_name = ? and users.status = ?`, ["Employee", "1"]);
        return response.json({ result: employeeData });
    } catch (err) {
        logger.error("Employee data is not found !");
    }
}

exports.employeeDetails = async (request, response) => {
    try {
        let employeeId = request.params.id;
        let employeeDetail = await db.executeQuery(`select users.* from users left join roles on users.role_id = roles.id where role_name = "Employee" and users.id = ?`, [employeeId]);
        return response.json({ employeeDetail });
    } catch (error) {
        logger.error("Employee data is not found !");
    }
}

exports.searchEmpData = async (request, response) => {
    try {
        let search = "%" + request.params.searchdata + "%";
        let searchData = await db.executeQuery(`select users.* from users left join roles on users.role_id = roles.id where role_name = ? and (first_name like ? or last_name like ?) `, ["Employee", search, search]);
        return response.json({ searchData });
    } catch (error) {
        logger.error("Not Search Data Found !")
    }
}

exports.empDataDelete = async (request, response) => {
    try {
        let id = request.params.id;
        let deletedata = await db.updateOr({ status: "0" }, "users", { id: id });
        return response.json({ deletedata });
    } catch (error) {
        logger.error("Employee Data Can't deleted !");
    }
}