function sc(act, id) {
  let row = document.getElementsByClassName("carddetails")[id];
  if (act == "next") {
    row.scrollLeft += 200;
  } else {
    row.scrollLeft -= 200;
  }
}
function showDropdown() {
  document.getElementById("dropdown").classList.toggle("show");
}

let path = window.location.pathname.split("/");
let id = path[path.length - 1];
console.log(id, "id is ");

var employeedata;
async function fetchData() {
  response = await fetch(`/employee/employeetasklist/${id}`);
  data = await response.json();
  employeedata = data;
  function setCard(id, element) {
    document.getElementById(`${id}`).innerHTML += `
      <div class="card1" onclick="show('popup','${element.task_id}')">
                <div class="field">
                  <h4>${element.task_name}</h4>
                </div>
                <div class="field">
                  <label>Description:</label>
                  <p>${element.task_description}</p>
                </div>
                <div class="field">
                  <label>due date :</label>
                  <p>${element.task_end_date}</p>
                </div>
              </div >`;
  }
  data.forEach((element) => {
    console.log(element, "elementic ");
    if (element.task_status == "todo") {
      setCard("todo", element);
    } else if (element.task_status == "inprogress") {
      setCard("inprogress", element);
    } else if (element.task_status == "completed") {
      setCard("completed", element);
    }
  });
}
fetchData();

var gtaskid;
let ides = (id) => document.getElementById(id);

const show = (id, taskid) => {
  ides(id).style.display = "block";
  console.log(taskid)
  gtaskid = taskid
  employeedata.forEach(element => {
    if (element.task_id == taskid) {
      document.getElementById("taskdetails").innerHTML = `
                  <div class="field">
                    <label>Task Name:</label>
                    <p>${element.task_name}</p>
                  </div>
                  <div class="field">
                    <label>Description:</label>
                    <p>${element.task_description}</p>
                  </div>
                  <div class="field">
                    <label>start date :</label>
                    <p>${element.task_start_date}</p>
                  </div>
                   <div class="field">
                    <label>end date :</label>
                    <p>${element.task_end_date}</p>
                  </div>
                   <div class="field">
                   <label>task status:</label>
                    <p>${element.task_status}</p>
                  </div>
                   <div class="field">
                   <label>prioritiy :</label>
                    <p>${element.prioritiy_id}</p>
                  </div>
                   <div class="field">
                   <label>category name:</label>
                    <p>${element.category}</p>
                  </div>
                   <div class="field">
                   <label>manager name :</label>
                    <p>${element.first_name}</p>
                  </div>
                    <div class="modal-footer-user" id="commentpopup">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"
                      onclick="showComment('popup-comment',${element.task_id})">Comment</button>
                    <button type="button" onclick="hide('popup')" class="btn btn-primary">Close</button>
                  </div>

                </div >`;
    }
  });
};

const hide = (id) => {
  ides(id).style.display = "none";
};

let ides_comment = (id) => document.getElementById(id);

const showComment = (id, taskid) => {

  document.getElementById('popup').style.display = "none";
  employeedata.forEach(element => {
    if (element.task_id == taskid) {
      ides_comment(id).style.display = "block";
    }
  });
}

const hideComment = (id) => {
  ides_comment(id).style.display = "none";
};

//user search section
async function seachresult() {
  if (document.getElementById('searchinput').value != "") {
    obj = {}
    new FormData(document.getElementById('form')).forEach((value, key) => {
      obj[key] = value;
    })
    console.log(obj, "obj is ")
    const response = await fetch(`http://127.0.0.1:8000/employee/searchtask`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(obj)
    })
    data = await response.json()

    ides('todo').style.display = "none";
    ides('inprogress').style.display = "none";
    ides('completed').style.display = "none";

    function resetCard(id, element) {
      document.getElementById(`${id}`).innerHTML = ''
      document.getElementById(`${id}`).innerHTML += `
      <div class="card1" onclick="show('popup','${element.task_id}')">
                <div class="field">
                  <h4>${element.task_name}</h4>
                </div>
                <div class="field">
                  <label>Description:</label>
                  <p>${element.task_description}</p>
                </div>
                <div class="field">
                  <label>due date :</label>
                  <p>${element.task_end_date}</p>
                </div>
              </div >`
    }
    data.forEach(element => {
      console.log(element, "elementic ")
      if (element.task_status == 'todo') {
        console.log("todo list ===================")
        ides('todo').removeAttribute('style')
        resetCard('todo', element)
      }

      else if (element.task_status == 'inprogress') {
        console.log("inprogress list ===================")
        ides('inprogress').removeAttribute('style')
        resetCard('inprogress', element)

      }
      else if (element.task_status == 'completed') {
        console.log("completed list ===================")
        ides('completed').removeAttribute('style')
        resetCard('completed', element)

      }
    });
  }
}

async function addcomment() {

  const formData = new FormData()
  const fields = ['taskcomment', 'taskstatus']
  formData.append('file', document.getElementById('file'))
  let file=document.getElementById('file');
  formData.append('file', file.files[0])
  fields.forEach((element) => {
    formData.append(element, document.getElementById(element).value)

  });
  console.log(formData, "formdatai si sfsdfjsdfhasl;fhasdlfghasdhgasdlh")
  const response = await fetch(`http://127.0.0.1:8000/employee/addcomment/${id}/${gtaskid}`, {
    method: 'POST',
    body: formData
  })
  let data= await response.json()
  console.log(data,"{}{}{}")
}
