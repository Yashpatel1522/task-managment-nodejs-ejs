const database = require("../../helpers/database.helper");
const logger = require("../../logger/logger");
var pdf = require("pdf-creator-node");
var fs = require("fs");
const { log } = require("winston");
let db = new database();

const getPdfData = async (request, response) => {
  try {
    let managerId = request.user.id;
    let employeeQ = `select id, first_name, last_name, email from users where id in (select distinct(emp_id) from tasks_assigend_to) and status = 1 and id = ?`;
    let employeeRes = await db.executeQuery(employeeQ, [request.query.id]);

    let taskQ = `select assigned.emp_id, tasks.task_name, tasks.task_status from tasks_assigend_to as assigned 
      inner join tasks on assigned.task_id = tasks.id where assigned.emp_id = ?;`;
    let taskRes = await db.executeQuery(taskQ, [request.query.id]);

    let taskResult = taskRes.reduce((acc, curr) => {
      acc[curr.emp_id] ??= {
        id: curr.emp_id,
        task_name: [],
        task_status: []
      }
      acc[curr.emp_id].task_name.push(curr.task_name);
      acc[curr.emp_id].task_status.push(curr.task_status);
      return acc;
    }, {});

    let overdueQ = `select assigned.emp_id, tasks.task_name from tasks_assigend_to as assigned
      inner join tasks on assigned.task_id = tasks.id
      where tasks.task_end_date < '2024-05-01' and tasks.task_status != 'compleated' and assigned.emp_id = ?;`;
      let taskoverdueRes = await db.executeQuery(overdueQ, [request.query.id]);

      let taskArr = [];
      let taskoverdueResult = taskoverdueRes.reduce((acc, curr) => {
        acc[curr.emp_id] ??= {
          id: curr.emp_id,
          task: taskArr
        }
        acc[curr.emp_id].task.push(curr.task_name);
        return acc;
      }, {});

      let reportQ = `select users.first_name, users.last_name, tasks_assigend_to.emp_id, tasks_assigend_to.finished_at, tasks.task_end_date from tasks_assigend_to
      inner join users on users.id = tasks_assigend_to.emp_id
      inner join tasks on tasks.id = tasks_assigend_to.task_id
      where tasks.manager_id = ? and tasks_assigend_to.emp_id = ?;`;
    let res = await db.executeQuery(reportQ, [managerId, [request.query.id]]);

    let result = res.reduce((acc, curr) => {
      acc[curr.emp_id] ??= {
        first_name: curr.first_name,
        last_name: curr.last_name,
        end_date: [],
        finished_date: []
      }
      acc[curr.emp_id].finished_date.push(curr.finished_at),
        acc[curr.emp_id].end_date.push(curr.task_end_date)
      return acc;

    }, {});

    const keys = Object.keys(result);
    let avgArr = [];
    keys.forEach(element => {
      let counter = 0;
      result[element].finished_date.forEach(function (elementArr, index) {
        if (elementArr < result[element].end_date[index]) {
          counter++;
        }
      });
      avgArr.push(((counter / result[element].finished_date.length) * 100).toFixed(2));
    });

    

      var options = {
          format: "A3",
          orientation: "portrait",
          border: "10mm",
          header: {
              height: "20mm",
              contents: `<div style="text-align: center;">Author: ${request.user.first_name} ${request.user.last_name}</div>`
          },
          footer: {
              height: "28mm",
              contents: {
                  first: 'Cover page',
                  2: 'Second page',
                  default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
                  last: 'Last Page'
              }
          }
      };

      let str = `<h1 style="text-align: center; color:tomato; padding-bottom: 10px">Employee Report</h1>
      <p style="font-size: 23px"><b>Name : </b>${employeeRes[0].first_name} ${employeeRes[0].last_name}</p><p style="font-size: 23px"><b>Email : </b>${employeeRes[0].email}</p>
      <br><h3 style="font-size: 20px"><u>Tasks List</u></h3>`;

      if(Object.keys(taskResult).length != 0) {
        str += `<table style="border:1px solid black" cellspacing="0"><tr><th style="color: MediumSeaGreen; font-size: 18px;">Task Name</th><th style="color: MediumSeaGreen; font-size: 18px;">Task Status</th></tr>`;
        taskResult[employeeRes[0].id].task_name.forEach(function (element, index) {
          str += `<tr><td style="font-size: 18px">${element}</td><td>${taskResult[employeeRes[0].id].task_status[index]}</td></tr>`;
        });
      str += `</table>`;
      }

      if(Object.keys(taskResult).length == 0) {
        str += `<p style="font-size: 18px">No Tasks Assigned yet</p>`;
      }

      str += `<br><h3 style="font-size: 20px"><u>Overdue Tasks</u></h3>`;
      if(Object.keys(taskoverdueResult).length != 0) {
        taskoverdueResult[employeeRes[0].id].task.forEach(element => {
          str += `<p style="font-size: 18px">${element}</p>`;
        });
      }
      else {
        str += `<p style="font-size: 18px">No Overdue Tasks</p>`;
      }



      if(avgArr[0]) {
        str += `<br><p style="font-size: 20px"><b><u>Productivity Ratio</u> : </b>${avgArr[0]}%</p>`;
      }
      else {
        str += `<br><p style="font-size: 20px"><b><u>Productivity Ratio</u> : </b>0.00%</p>`;
      }



    var document = {
      html: str,
      path: `public/assets/pdfs/${request.query.id}_report.pdf`,
      type: "",
    };

    pdf
    .create(document, options)
    .then((res) => {
    })
    .catch((error) => {
      console.error(error);
    });



    return response.json({ filename: `${request.query.id}_report.pdf` });
  } catch (error) {
    logger.error(error);
    return response.send({ error: error });
  }
};


module.exports = getPdfData;