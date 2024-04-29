const { syslog } = require("winston/lib/winston/config");
const database = require("../../helpers/database.helper");
const logger = require("../../logger/logger");
const db = new database();

// module.exports={UserTaskList}

const teamlist = async (req, res) => {
  try {
    res.render("employeemodule/emplyeeteam");
  } catch (err) {
    logger.error("Employee Task data is not found !");
  }
};

const teamdata = async (req, res) => {
  try {
    // id = req.params.id
    const query = `select t.id,t.team_name,u.first_name,m.emp_id from teams as t inner join team_members as m on t.id=m.team_id inner join users as u on t.created_by=u.id where (t.is_active=1 and m.is_deleted=0 and m.emp_id=?)`//employee in how many team
    let result = await db.executeQuery(query, [11])
    res.json(result)
  }
  catch (error) {
    logger.error("Employee Task data is not found !");
  }
};

const teamdetails = async (req, res) => {
  try {
    id = req.params.teamid;
    // id = 1
    const query1 = `select a.*,t.task_name from team_has_tasks as a 
    inner join tasks as t on a.task_id=t.id where (a.team_id=? and t.status =1);`//assign task on team 
    let result1 = await db.executeQuery(query1, id);
    const query2 = `select t.id,t.team_id,u.first_name from team_members as t 
    inner join users as u on t.emp_id=u.id where (t.team_id = ? and t.is_deleted=0);`//members on particular team
    let result2 = await db.executeQuery(query2, id);

    const responsedata = {
      result1: result1,
      result2: result2,
    };
    res.json(responsedata);
  } catch (error) {
    logger.error(error);
  }
};

const teamsearchdetails = async (req, res) => {
  try {
    let search = "%" + req.params.searchteam + "%";
    let searchTeam = await db.executeQuery(
      `select t.id,t.team_name,u.first_name from teams as t inner join team_members as m on m.team_id=t.id inner join users as u on u.id=t.created_by where m.emp_id=? and t.team_name like ?`,
      [1, search]
    );
    return res.json(searchTeam);
  } catch (error) {
    logger.error("Team data not found it!");
  }
};

module.exports = { teamlist, teamdata, teamdetails, teamsearchdetails };
