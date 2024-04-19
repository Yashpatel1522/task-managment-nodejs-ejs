const database = require("../../helpers/database.helper");
const logger = require("../../logger/logger");
var db = new database();

exports.adminDashboard = async (request, response) => {
    try {
        let query = `select r.role_name,count(*) as count from users as u inner join roles as r on u.role_id = r.id group by u.role_id having r.role_name = ?`;
        let [count] = await db.executeQuery(query, ["Employee"]);
        let [count1] = await db.executeQuery(query, ["Manager"]);

        let employeeCount = 0;
        if (count !== undefined) {
            employeeCount = count.count;
        }
        let managerCount = 0;
        if (count1 !== undefined) {
            managerCount = count1.count;
        }

        let query1 = `select task_status,count(*) as count from tasks group by task_status having task_status = ?`;
        let [count2] = await db.executeQuery(query1, ["todo"]);
        let [count3] = await db.executeQuery(query1, ["inprogress"]);
        let [count4] = await db.executeQuery(query1, ["completed"]);

        let todoCount = 0;
        if (count2 !== undefined) {
            todoCount = count2.count;
        }

        let inprogressCount = 0;
        if (count3 !== undefined) {
            inprogressCount = count3.count;
        }

        let completedCount = 0;
        if (count4 !== undefined) {
            completedCount = count4.count;
        }
        let [teamCount] = await db.executeQuery(`select count(*) as count from teams where status = 1`);
        if (teamCount !== undefined) {
            teamCount = teamCount.count;
        }
        response.render("adminmodule/dashboard", { employeeCount, managerCount, teamCount, todoCount, inprogressCount, completedCount })
    } catch (err) {
        logger.error("Admin dashboard data error !")
    }
}

exports.chartsData = async (request, response) => {
    try {
        let chartData = await db.executeQuery(`select task_status as label , count(*) as data from tasks group by task_status`);
        return response.json({ chartData })
    } catch (err) {
        logger.error("Admin dashboard data error !")
    }
}

