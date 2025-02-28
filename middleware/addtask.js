function addTaskServervalidation(request, response, next) {
  let data = request.body;
  let validdob = /[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/;
  let serverErrObj = {};
  if (data.task_name.trim().length === 0) {
    serverErrObj.task_name_err = "* required";
  }
  if (data.task_status === 0) {
    serverErrObj.task_status_err = "* required";
  }
  if (data.task_category == 0) {
    serverErrObj.task_category = "* required";
  }
  if (data.task_end_date.trim().length === 0) {
    serverErrObj.end_date_err = "* required";
  } else if (!data.task_end_date.match(validdob)) {
    serverErrObj.end_date_err = "Please Enter valid date";
  }
  if (data.task_start_date.trim().length === 0) {
    serverErrObj.start_date_err = "* required";
  } else if (!data.task_start_date.match(validdob)) {
    serverErrObj.start_date_err = "Please Enter valid date";
  }

  if (data.task_description.trim().length === 0) {
    serverErrObj.description_err = "* required";
  }
  if (data.impotant_level == 0) {
    serverErrObj.impotant_level_err = "* required";
  }
  if (data.urgency_level == 0) {
    serverErrObj.urgency_level_err = "* required";
  }
  if (data.emp_id.length == 0) {
    serverErrObj.Assin_task_to_err = "* required";
  }
  if (Object.keys(serverErrObj).length > 0) {
    response.json(serverErrObj);
  } else {
    next();
  }
}
module.exports = addTaskServervalidation;
