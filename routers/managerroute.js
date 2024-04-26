const express = require("express");
const {
  searchTask,
  managerTasks,
  notifications,
} = require("../controller/managermodule/managertasks");
const taskCount = require("../controller/managermodule/taskCount");
const {
  employeeData,
  searchEmpData,
  removeEmployee,
} = require("../controller/managermodule/employeeData");
const updateManager = require("../controller/managermodule/updateManagerProfile");
const managerProfile = require("../controller/managermodule/getManagerProfile");
const dashboardView = require("../controller/managermodule/dashboard");
const employeeView = require("../controller/managermodule/employeeView");
const taskView = require("../controller/managermodule/taskView");
const getAllTasks = require("../controller/managermodule/getalltasks");
const upcomingTasks = require("../controller/managermodule/upcomingTasks");
const editTask = require("../controller/managermodule/edittask");
const {
  addtaskdata,
  inserttaskdata,
} = require("../controller/managermodule/addtask");
const multer = require("multer");
const {
  upload,
  taskdetailfiles,
  userProfileStorage,
} = require("../utility/multer");
const addtaskdatamiddleware = require("../middleware/addtask");
const {
  addteamdata,
  getempdata,
  addteam,
} = require("../controller/managermodule/addteam");
const {
  teamdetails,
  searchTeamData,
  showTeamDataForUpdate,
  updateTeamData,
  teamDetailsForView,
  deleteTeam,
} = require("../controller/managermodule/teamdata");
const getTeams = require("../controller/managermodule/getTeams");
const getEditDetails = require("../controller/managermodule/getEditTadkDetails");
const passport = require("passport");
const {
  viewComments,
  getComments,
  updateTaskStatus,
} = require("../controller/managermodule/comments");
const checkUserRole = require("../middleware/userrole");
const {
  calenderView,
  calenderMonth,
  dueDateTask1,
} = require("../controller/managermodule/calender");
const { reportGet } = require("../controller/employeemodule/reports");

// const uploadImage = multer({ storage: userProfileStorage });
// const addtaskdatamiddleware = require('../middleware/addtask');

// const {upload, taskdetailfiles, userProfileStorage } = require("../utility/multer");
const uploadStorage = multer({ storage: taskdetailfiles });
// const uploadImage = multer({ storage: userProfileStorage });
const uploadImage = multer({ storage: userProfileStorage });

const managerRouter = express.Router();

// // Displaying Tasks of manager

managerRouter.get("/calenderData/:month", calenderMonth);
managerRouter.get("/searchEmploye/:searchdata", searchEmpData);
managerRouter.get("/searchTask/:searchdata", searchTask);
managerRouter.post("/inserttask", upload.array("files"), inserttaskdata);

managerRouter.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/" }),
  checkUserRole
);

// Displaying Employee details
managerRouter.get("/employeeDetails", employeeView);

managerRouter.get("/Teams", (request, response) => {
  response.render("./managermodule/teams");
});

managerRouter.get("/tasks", taskView().getPage);

// Dashboard
managerRouter.get("/dashboard", dashboardView);

// API to get team details of the particular manager
managerRouter.get("/getTeams", getTeams);

//API to edit task Details
managerRouter.post("/editTaskDetails", editTask);

//Api to get details to edit tasks
managerRouter.get("/getEditTadkDetails", getEditDetails);

//API to get task details
managerRouter.get("/getTaskDetails/:id", getAllTasks);

managerRouter.get("/teamapi", teamdetails);
managerRouter.get("/getManagerTaskCount", taskCount);

//api to get upcoming manager tasks
managerRouter.get("/getManagerUpcomingTasks", upcomingTasks);

//api to Update Manager Profile Details
managerRouter.post(
  "/updateManager",
  uploadImage.single("profileimg"),
  updateManager
);

//api to get Manager Profile Details
managerRouter.get("/getManagerProfile/:id", managerProfile);

//api to get employee details
managerRouter.get("/getEmployees", employeeData);

managerRouter.delete("/removeemployeapi/:id", removeEmployee);
// api to get manager tasks
managerRouter.get("/getManagerTasks", managerTasks);

//api for Manager task Count

// // api for get user,category from database
managerRouter.get("/getdataapi", addtaskdata);

// insert task data

// serach task api
managerRouter.post("/searchtask", searchTask);

managerRouter.get("/notification", notifications);

// api to get only employe data for create team
managerRouter.get("/getempdata", getempdata);

managerRouter.post("/addteamdata", addteam);
managerRouter.get("/managerTeam/showteamdata/:id", showTeamDataForUpdate);
managerRouter.post("/updateteamdata", updateTeamData);
managerRouter.get("/teamapi/:id", teamDetailsForView);
managerRouter.delete("/deleteteamapi/:id", deleteTeam);

managerRouter.get("/comments/:teamId", viewComments);
managerRouter.get("/getcomments/:teamId", getComments);
managerRouter.post("/updateTaskStatus", updateTaskStatus);

managerRouter.get("/calender", calenderView);
managerRouter.get("/dueDateOfTask", dueDateTask1);

module.exports = managerRouter;
