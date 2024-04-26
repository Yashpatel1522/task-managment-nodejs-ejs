let dashboardData;
let profileData;
const assignBadge = (type) => {
  switch (type) {
    case 'urgent':
      return 'text-danger'
    case 'high':
      return 'text-danger';
    case 'mid':
      return 'text-primary';
    case 'low':
      return 'text-secondary';
    case 'inprogress':
      return 'badge text-bg-primary m-2'
    case 'completed':
      return 'badge text-bg-success m-2'
    case 'todo':
      return 'badge text-bg-secondary m-2'

  }
}
//dynamic table creation function
function createTable(tableData, section) {
  const keys = Object.keys(tableData[0]);

  let temp = `<tr>`;
  keys.map((el) => {
    temp += `<th scope="col">${el}</th>`;
  });
  temp += `</tr>`;
  document.getElementById(`${section}heading`).innerHTML = temp;

  temp = "";
  tableData.map((dataobj) => {
    const vals = Object.values(dataobj);

    temp += `<tr>`;
    vals.map((val) => {
      temp += `<td class="${assignBadge(val)}">${val}</td>`;
    });
    temp += `</tr>`;
  });
  document.getElementById(`${section}body`).innerHTML = temp;
}

const showNoData = (section) => {
  console.log(`${section}body`);
  document.getElementById(`${section}body`).innerHTML = `<h3 class="text-center mt-4">No Data</h3>`;
}

// function for rendering dashboardData dynamically
const renderData = (dashboardData) => {

  dashboardData.upCommingDeadlineData.length != 0
    ? createTable(dashboardData.upCommingDeadlineData, "deadline")
    : showNoData("deadline");
  dashboardData.employeeInprogressTaskData.length != 0
    ? createTable(dashboardData.employeeInprogressTaskData, "inprogress")
    : showNoData("inprogress");

    let TaskActivity = document.getElementById("recentactivitybody");
    let logs = ""
    dashboardData.employeeRecentActivityData.forEach(e => {
      if(e.task_name){
        logs += `<p class="mx-3"><span class="text-secondary"> ${e.first_name} assigned you</span> <span class = "text-success"> ${e.task_name}  task</span> <small class="fs-6">${e.create_date.split(' ')[1]}</small> </p>`
      }
      else{

        logs += `<p class="mx-3"><span class="text-secondary"> ${e.first_name} added you </span> <span class = "text-success"> ${e.team_name} team</span> <small class="fs-6">${e.create_date.split(' ')[1]}</small></p>`
      }
    });
    TaskActivity.innerHTML = logs;
};

getDashBoardData("/employee/getdashboardata").then((data) => {
  dashboardData = data.result;
  renderData(dashboardData);
});

async function getDashBoardData(url) {
  const response = await fetch(url);
  return response.json();
}

async function loadProfile() {
  let response = await fetch("/employee/getprofiledata").then((response) => { return response.json() }).then((data) => {
    profileData = data.result;
    renderProfileData(profileData)
  })
}
