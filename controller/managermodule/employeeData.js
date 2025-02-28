const { request } = require("express");
const database = require("../../helpers/database.helper");
const logger = require("../../logger/logger");
let db = new database();

const employeeData = async (request, response) => {
  try {
    let query = `select * from users where role_id = ? and status = ?`;
    let res = await db.executeQuery(query, [3, 1]);

    const imageQuery = `select newimage_name from user_profiles where user_id in (select id from users where role_id = 3 and status = 1) and is_deleted = 0;`;
    const imageRes = await db.executeQuery(imageQuery);

    return response.json({ result: res, imageRes: imageRes});
  } catch (error) {
    logger.log(error);
    return response.send({ error: error });
  }
};

const searchEmpDatas = async (request, response) => {
  try {
    let search = "%" + request.params.searchdata + "%";
    let searchData = await db.executeQuery(
      `select * from users left join roles on users.role_id = roles.id where role_name = ? and (first_name like ? or last_name like ?) and users.status = ?`,
      ["Employee", search, search, 1]
    );
    return response.json({ searchData });
  } catch (error) {
    logger.error("Not Search Data Found !");
  }
};

const removeEmployee = async (request, response) => {
  try {
    let deletedata = await db.updateOr({ status: "0" }, "users", {
      id: request.params.id,
    });
    return response.json({ deletedata });
  } catch (error) {
    logger.error("Remove employee successfully");
  }
};

module.exports = { employeeData, searchEmpDatas, removeEmployee };
