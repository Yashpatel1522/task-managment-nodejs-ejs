let taskFlag = false;

const setData = async () => {
  let url = window.location.origin + `/manager/getEmployees`;
  let response = await fetch(url);
  let data = await response.json();
  let str = ``;
  if (data.result) {
    let count = 0;
    for (let i = 0; i < Math.ceil(data.result.length / 3); i++) {
      str += `<div class="row pb-3">`;
      for (let j = 0; j < 3; j++) {
        if (data.result[count]) {
          str += `
                    <div class="col-4 ">
                        <div class="card" style="width: 100%;">
                            <img src="" class="card-img-top" alt="">
                            <div class="card-body bg-light cardview" style="border-radius: 10px;">
                                <h5 class="card-title textview" style="font-size: 25px;">${data.result[count].first_name} ${data.result[count].last_name}</h5>
                                <br>
                                <p class="card-text textview"><b>Email - </b>${data.result[count].email}</p>
                                <p class="card-text textview"><b>Birth Date - </b>${data.result[count].date_of_birth}</p>
                                <button class="btn btn-primary btnview" style = "background-color:#0A1828" onclick="showEmployeeDetails(${data.result[count].id}, '${data.result[count].first_name}', '${data.result[count].last_name}', '${data.result[count].email}', '${data.result[count].contact}', '${data.result[count].date_of_birth}', '${data.result[count].create_at}', '${data.result[count].img_url}')">View More</button>
                                <input type="button" value="Remove"  style = "background-color:#0A1828" class="btn btn-secondary px-3 btnview" onclick="removeEmployee(${data.result[count].id})">
                            </div>
                        </div>
                    </div>
                    `;
          count++;
        }
      }
      str += `</div>`;
    }
  }
  document.getElementsByClassName("employeeList")[0].innerHTML = str;
};

async function showEmployeeDetails(
  id,
  first_name,
  last_name,
  email,
  contact,
  dob,
  join,
  img_url
) {
  let url = window.location.origin + `/manager/getManagerProfile/${id}`;
  let response = await fetch(url);
  let data = await response.json();
  let path = ``;
  if (!data.imageResult[0]) {
    path = `/assets/employee/user.png`;
  } else {
    path = `/assets/userprofiles/${data.imageResult[0].newimage_name}`;
  }

  await Swal.fire({
    position: "top",
    title: `Full Details`,
    html: `
      <img src="${path}" height="150px"><br><br>
      <p><b>Employee Id : </b>${id}</p>
      <p><b>First Name : </b>${first_name}</p>
      <p><b>Last Name : </b>${last_name}</p>
      <p><b>Email : </b>${email}</p>
      <p><b>Contact : </b>${contact}</p>
      <p><b>Birth Date : </b>${dob}</p>
      <p><b>Date Of Joining : </b>${join.slice(0, 10)}</p>
    `,
    confirmButtonText: "Close",
  });
}

const searchEmployee = async (value) => {
  try {
    let data = await (await fetch(`/manager/searchEmploye/${value}`)).json();
    if (value.trim() === "") {
      setData();
    } else {
      if (value === "") {
        setData();
      }
      let str = ``;
      if (data.searchData.length != 0) {
        let count = 0;
        for (let i = 0; i < Math.ceil(data.searchData.length / 3); i++) {
          str += `<div class="row pb-3">`;
          for (let j = 0; j < 3; j++) {
            if (data.searchData[count]) {
              str += `
                    <div class="col-4">
                        <div class="card" style="width: 100%;">
                            <img src="" class="card-img-top" alt="">
                            <div class="card-body bg-light cardview" style="border-radius: 10px;">
                                <h5 class="card-title textview" style="font-size: 25px;">${data.searchData[count].first_name} ${data.searchData[count].last_name}</h5>
                                <br>
                                <p class="card-text textview"><b>Email - </b>${data.searchData[count].email}</p>
                                <p class="card-text textview"><b>Birth Date - </b>${data.searchData[count].date_of_birth}</p>
                                  <button class="btn btn-primary btnview" style = "background-color:#0A1828" onclick="showEmployeeDetails(${data.searchData[count].id}, '${data.searchData[count].first_name}', '${data.searchData[count].last_name}', '${data.searchData[count].email}', '${data.searchData[count].contact}', '${data.searchData[count].date_of_birth}', '${data.searchData[count].create_at}', '${data.searchData[count].img_url}')">View More</button>
                                <input type="button" value="Remove" class="btn btn-secondary px-3 btnview" style = "background-color:#0A1828" onclick="removeEmployee(${data.searchData[count].id})">
                            </div>
                        </div> 
                    </div>
                    `;
              count++;
            }
          }
          str += `</div>`;
        }
        document.getElementsByClassName("employeeList")[0].innerHTML = str;
      } else {
        document.getElementsByClassName(
          "employeeList"
        )[0].innerHTML = `<div class="alert alert-info">
  <strong>data not found!</strong> 
</div>`;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const removeEmployee = async (id) => {
  try {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success btn-gap",
        cancelButton: "btn btn-danger btn-gap",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await fetch(`http://localhost:8000/manager/removeemployeapi/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          swalWithBootstrapButtons
            .fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            })
            .then(async (result2) => {
              if (result2.isConfirmed) {
                setData();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your date is safe :)",
            icon: "error",
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};
