var collectedPlantName = document.getElementById("inputPlantName");
var collectedActivity = document.getElementById("inputPlantAc");
var collectedDuration = document.getElementById("inputPlantDura");
var errDivModal = document.querySelectorAll("#err-div-modal");
var extendHeader = document.querySelector("#extend-header");
var btnHeader = document.querySelectorAll("#new-activity-btn");
var textBtnHeader = document.querySelectorAll("#tetx-btn-header");
var editPlantBtn = document.querySelectorAll("#dd-edit-plant")
var errText = document.getElementById("warning-del-body");
var modalFormBody = document.querySelectorAll("#modal-plant-body");
var modalLoading = document.querySelectorAll("#modal-loading");
var modalSuccess = document.querySelectorAll("#modal-plant-success");
var delPlantBtn = document.querySelectorAll(".del-plant-btn");
var ddDelPlant = document.querySelectorAll("#dd-del-plant");
var cancelModal = document.querySelectorAll("#cancel-form");
var output = document.getElementById("result");
var plantDetailsContent = document.getElementById("plant-detail");
var plantListContent = document.getElementById("plant-list");
var plantModalStatus = document.getElementById("modal-plant-status")
var collectedPlantImage = [];
var plantArray = [];
var pictureArray = [];
var plantId = getPlantId();
var plantObj , plantName;

localStorage.removeItem("lands");
  localStorage.removeItem("percent-lands");
  localStorage.removeItem("poly-lands-main")

//*สร้าง card พืชที่มีอยู่
async function createExitingPalntUI(allPlants) {
  $("#plant-list").show(500);
  extendHeader.innerHTML = "";
  output.innerHTML = "";
  collectedPlantName.value = ""
  $("#input-plant-image").css("display", "block");
  $("#header-plant-list").css("display", "block");
  $("#header-plant-detail").css("display", "none");
  if(allPlants.length == 0){
    var noplant = document.createElement("center");
    noplant.style.color = "grey"
    noplant.innerHTML = '<h2>ยังไม่มีพืช</h2><h3>กดปุ่ม "เพิ่มพืชใหม่" เพื่อเริ่มบันทึก</h3>'
    document.getElementById('plant-list').parentNode.appendChild(noplant)
  }
  for (let j = 0; j < btnHeader.length; j++) {
    btnHeader[j].dataset.target = "#modal-add-plant";
    textBtnHeader[j].innerHTML = "เพิ่มพืชใหม่";
    delPlantBtn[j].style.display = "none";
    editPlantBtn[j].style.display = "none"
  }
  plantDetailsContent.style.display = "none";
  plantListContent.style.display = "block";

  plantListContent.innerHTML = "";
  for (var i = 0; i < allPlants.length; i++) {
    plant = allPlants[i];
    var coverImage =
      plant.cover_image != null
        ? headerImage + plant.cover_image
        : "images/vegetables.png";

    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.marginRight = "14px";
    div.style.marginBottom = "14px";
    var children = document.createElement("div");
    children.setAttribute("class", ".block");
    var imageShow = document.createElement("img");
    imageShow.style.boxShadow =
      "0 0 2px rgba(0,0,0,.125),0 2px 3px rgba(0,0,0,.2)";
    imageShow.setAttribute("class", "myImg");
    imageShow.setAttribute("src", coverImage);

    var plantName = document.createElement("h4");
    plantName.innerHTML = plant.name;
    plantName.setAttribute("class", "plant-name");
    plantName.onclick = (function(arg) {
      return function() {
        history.pushState({ page: 2 }, arg.name, "?plant=" + arg._id);
        createPlanteDetailUI(arg);
      };
    })(plant);
    var shadow = document.createElement("div");
    shadow.setAttribute("class", "cover-black");
    shadow.onclick = (function(arg) {
      return function() {
        history.pushState({ page: 2 }, arg.name, "?plant=" + arg._id);
        createPlanteDetailUI(arg);
      };
    })(plant);

    children.appendChild(shadow);
    children.appendChild(plantName);
    children.appendChild(imageShow);
    div.appendChild(children);
    plantListContent.insertBefore(div, null);
  }
}

//*get ข้อมูลพืชจาก db | return jsondata
async function loadPlantDataAPI(newerData) {
  if (!newerData) {
    localStorage.removeItem("by-name");
    localStorage.removeItem("by-date");
    var allPlants = localStorage["plants"];
    if (allPlants) {
      allPlants = JSON.parse(allPlants);
      return allPlants;
    }
  }
  try {
    var url = "/plants/" + ownerId;
    var getAllPlant = await connectToServer(url, "", "GET");
    setCacheData("plants", getAllPlant);
    return getAllPlant;
  } catch (err) {
    console.log(e);
  }
}
//*upload ภาพปกพืช | retuen file name

//*post พืชใหม่ to db
async function postNewPlantstoDB(imageName) {
  try {
    var url = "/plants/" + ownerId;
    var body = JSON.stringify({
      name: collectedPlantName.value,
      cover_image: imageName
    });
    var postNewPlants = await connectToServer(url, body, "POST");
    console.log("create new plant success");
  } catch (err) {
    if(err.status == 400){
      plantModalStatus.innerHTML = `คุณใช้ชื่อพืช '${collectedPlantName.value} แล้ว กรุณาตั้งชื่อใหม่'`
    }
    console.log(collectedPlantName.value)
    console.log(imageName);
  }
}//*edit พืช to db
async function putPlantstoDB(imageName) {
  try {
    var url = "/plants/" + plantId;
    var body = JSON.stringify({
      name: collectedPlantName.value,
      cover_image: imageName
    });
    var postNewPlants = await connectToServer(url, body, "PUT");
    console.log("create new plant success");
  } catch (err) {
    console.log(err.responseText);
    console.log(imageName);
  }
}
//*post new plant activity to db
async function postNewActivity(plantId) {
  try {
    var url = "/plants/activity/" + plantId;
    var body = JSON.stringify({
      tasks: collectedActivity.value,
      duration: collectedDuration.value
    });
    var newPlantActivity = await connectToServer(url, body, "POST");
    $("#text-modal-response").html(
      `เพิ่มกิจกรรม "${collectedActivity.value}" สำเร็จแล้ว`
    );
    console.log("create new plant activity success");
  } catch (err) {
    if (err.status == 200) {
      $("#text-modal-response").html(
        `เพิ่มกิจกรรม "${collectedActivity.value}" สำเร็จแล้ว`
      );
    } else {
      console.log(err);
      $("#text-modal-response").html(
        `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง`
      );
    }
  }
}
//*edit plant activity to db
async function putEditActivity(plantId, activityId) {
  window.plantAcId = null;
  try {
    var url = `/plants/activity/${plantId}?activity=${activityId}`;
    var body = JSON.stringify({
      tasks: collectedActivity.value,
      duration: collectedDuration.value
    });
    var editActivity = await connectToServer(url, body, "PUT");
    $("#text-modal-response").html(`แก้ไขกิจกรรมสำเร็จ`);
    console.log("edit plant activity success");
  } catch (err) {
    $("#text-modal-response").html(
      `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง`
    );
    console.log(err.responseText);
    console.log(collectedPlantName);
    console.log(imageName);
  }
}
//* delete activity
async function deletePlantActivity(plantId, activityId) {
  window.plantAcId = null;
  try {
    var url = `/plants/activity/${plantId}?activity=${activityId}`;
    var deleteActivity = await connectToServer(url, "", "DELETE");
    console.log("delete plant activity success");
  } catch (err) {
    console.log(err);
  }
}
//* delete plant
async function deletePlant(plantId) {
  window.plantAcId = null;
  try {
    var url = `/plants/${plantId}`;
    var deleteActivity = await connectToServer(url, "", "DELETE");
    return true;
  } catch (err) {
    if (err.status == 400) {
      var textResponse = document.getElementById("text-modal-response");
      var parentTextRes = textResponse.parentNode;
      textResponse.innerHTML = `ไม่สามารถลบ ${plantName} ได้`;
      parentTextRes.innerHTML += `<hr>เกิดข้อผิดพลาด : เนื่องจาก ${plantName} อยู่ระหว่างการดำเนินกิจกรรม คุณต้องกรอกข้อมูลเก็บผลผลิตก่อน จึงจะสามารถดำเนินการลบได้`;
      return false;
    } else if (err.status == 200) {
      console.log("delete plant success");
    } else {
      $("#text-modal-response").html(
        `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง`
      );
      return false;
    }
    return true;
  }
}
//*div plant cover image on modal
function outputImageUI(canvas, filename) {
  output.innerHTML = "";
  var div = document.createElement("div");
  div.style.display = "inline-block";
  div.style.marginRight = "14px";
  div.style.marginBottom = "14px";
  var children = document.createElement("div");
  children.setAttribute("class", ".block");
  // canvas to img
  var imageShow = document.createElement("img");
  imageShow.setAttribute("class", "myImg");
  imageShow.setAttribute("src", canvas);
  imageShow.setAttribute("alt", filename);

  // delete icon
  var deleteBt = document.createElement("img");
  deleteBt.setAttribute("class", "delete-img-btn");
  deleteBt.setAttribute("src", "images/close.png");
  deleteBt.onclick = (function(arg, index) {
    return function() {
      $("#input-plant-image").css("display", "block");
      for (i in pictureArray) {
        if (pictureArray[i].name == index) {
          pictureArray.splice(i, 1);
          break;
        }
      }
      arg.parentNode.removeChild(arg);
    };
  })(div, filename);

  children.appendChild(deleteBt);
  children.appendChild(imageShow);
  div.appendChild(children);
  output.insertBefore(div, null);
  $("#input-plant-image").css("display", "none");
}
//* check input plant name
function checkValidityForm(arr, formDiv) {
  var pass = false;
  for (i in arr) {
    if (arr[i].checkValidity()) {
      pass = true;
    } else {
      pass = false;
      var textErr = document.createElement("p");
      textErr.innerHTML = "*กรุณากรอกข้อมูลให้ครบถ้วน";
      textErr.style.color = "red";
      formDiv.innerHTML = textErr.outerHTML;
      return pass;
    }
  }
  return pass;
}
//*create body plant detail
function createPlanteDetailUI(plant) {
  //----------header----------
  $("#plant-detail").show(500);
  plantName = plant.name;
  plantObj = plant;
  extendHeader.innerHTML = `&nbsp;&nbsp;${plantName}`;
  $("#header-plant-list").css("display", "none");
  $("#header-plant-detail").css("display", "block");
  for (let i = 0; i < btnHeader.length; i++) {
    textBtnHeader[i].innerHTML = "เพิ่มกิจกรรม";
    btnHeader[i].dataset.target = "#modal-add-acplant";
    delPlantBtn[i].style.display = "block";
    editPlantBtn[i].style.display = "block"

  }
  //--------body-----------
  plantDetailsContent.style.display = "block";
  plantListContent.style.display = "none";
  plantDetailsContent.innerHTML = "";
  if (plant.activities.length == 0) {
    var divNoAc = document.createElement("div");
    divNoAc.style.marginTop = "10vh";
    var noAcText = document.createElement("center");
    noAcText.innerHTML =
      "<h2>ยังไม่มีกิจกรรมสำหรับ" +
      plant.name +
      '</h2><h2>กดปุ่ม "เพิ่มกิจกรรม" เพื่อสร้างกิจกรรมใหม่</h2>';
    noAcText.style.color = "#717880";
    divNoAc.appendChild(noAcText);
    plantDetailsContent.appendChild(divNoAc);
  } else {
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    plantDetailsContent.appendChild(row);
    var activities = plant.activities;
    activities.sort(dynamicSort("duration"));
    for (i in plant.activities) {
      var activity = plant.activities[i];
      var col = document.createElement("div");
      var card = document.createElement("div");
      var cardBody = document.createElement("div");
      var table = document.createElement("table");
      var tr = document.createElement("tr");
      var duration = document.createElement("td");
      var task = document.createElement("td");
      var ddMenu = document.createElement("td");
      var ulMenu = document.createElement("ul");
      var liEdit = document.createElement("li");
      var liDel = document.createElement("li");

      col.setAttribute("class", "col-md-12");
      card.setAttribute("class", "card");
      cardBody.setAttribute("class", "card-body");
      table.setAttribute("class", "table");

      duration.innerHTML = `สัปดาห์ที่ ${activity.duration}`;
      duration.style.color = "green";
      duration.style.width = "33.33%";
      task.innerHTML = activity.tasks;
      task.style.width = "33.33%";
      task.style.textAlign = "center";
      ddMenu.style.textAlign = "right";
      ddMenu.style.width = "33.33%";
      ddMenu.innerHTML =
        '<button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i style="font-size:1.2rem;color:#8e8580" class="fas fa-ellipsis-h"></i></button>';
      ulMenu.setAttribute("class", "dropdown-menu");
      ulMenu.setAttribute("x-placement", "top-start");
      ulMenu.style.position = "absolute";
      ulMenu.style.willChange = "transform";
      ulMenu.style.top = "0px";
      ulMenu.style.left = "0px";
      ulMenu.style.transform = "translate3d(-37px, -84px, 0px)";

      liEdit.innerHTML = '<a class="dropdown-item text-primary">แก้ไข</a>';
      liDel.innerHTML = '<a class="dropdown-item text-danger">ลบ</a>';

      liEdit.onclick = (function(arg) {
        return function() {
          stateModal("form");
          $("#modal-add-acplant").modal("show");
          window.plantAcId = arg._id;
          collectedActivity.value = arg.tasks;
          collectedDuration.value = arg.duration;
        };
      })(activity);
      liDel.onclick = (function(arg) {
        return function() {
          window.delEvent = "activity";
          stateModal("delete");
          errText.innerHTML =
            ' <center><h3 class="text-danger">คุณต้องการลบกิจกรรมนี้ใช่หรือไม่</h3><hr></center><p>&nbsp;&nbsp;โปรดทราบว่าหากคุณดำเนินการต่อ ความคืบหน้าในกิจกรรมและการดำเนินการต่างๆที่เกี่ยวข้องจะสูญหายคุณยืนยันที่จะดำเนินการต่อหรือไม่</p>';
          $("#modal-add-acplant").modal("show");
          window.plantAcId = arg._id;
        };
      })(activity);

      ulMenu.appendChild(liEdit);
      ulMenu.appendChild(liDel);
      ddMenu.appendChild(ulMenu);
      tr.appendChild(duration);
      tr.appendChild(task);
      tr.appendChild(ddMenu);
      table.appendChild(tr);
      cardBody.appendChild(table);
      card.appendChild(cardBody);
      col.appendChild(card);
      row.appendChild(col);
    }
  }
}
//* ย้อนกลับไปหน้าจัดการพืชหลัก
window.onpopstate = function() {
  selPage();
};
//*เปลี่ยน content modal
function stateModal(event) {
  switch (event) {
    case "form":
      modalFormBody[0].style.display = "block";
      modalLoading[0].style.display = "none";
      modalSuccess[0].style.display = "none";

      modalFormBody[1].style.display = "block";
      modalLoading[1].style.display = "none";
      modalSuccess[1].style.display = "none";
      $("#modal-plant-delete").css("display", "none");
      break;
    case "loading":
      modalFormBody[0].style.display = "none";
      modalLoading[0].style.display = "block";
      modalSuccess[0].style.display = "none";

      modalFormBody[1].style.display = "none";
      modalLoading[1].style.display = "block";
      modalSuccess[1].style.display = "none";
      $("#modal-plant-delete").css("display", "none");
      break;
    case "success":
      modalFormBody[0].style.display = "none";
      modalLoading[0].style.display = "none";
      modalSuccess[0].style.display = "block";

      modalFormBody[1].style.display = "none";
      modalLoading[1].style.display = "none";
      modalSuccess[1].style.display = "block";
      $("#modal-plant-delete").css("display", "none");
      break;
    case "delete":
      modalFormBody[1].style.display = "none";
      modalLoading[1].style.display = "none";
      modalSuccess[1].style.display = "none";
      $("#modal-plant-delete").css("display", "block");
      break;
  }
}
//*get plant id from url
function getPlantId() {
  var url = window.location.toString();
  var plantIndex = url.indexOf("plant=") + 6;
  var plantId = url.slice(plantIndex, url.length);
  console.log(plantId)
  return plantId;
}
//*init button
async function initBtn() {
  $("#save-plant-modal-btn").click(async () => {
    plantId = getPlantId()
    if(plantId.length == 24){
      var name = [collectedPlantName];
      var pass = checkValidityForm(name, errDivModal[0]);
      var fileName = plantObj.cover_image ? plantObj.cover_image : `${ownerId}_${plantId}`
      if (pass) {
        stateModal("loading");
        plantModalStatus.innerHTML = `แก้ไข ${collectedPlantName.value} สำเร็จแล้ว`
        var imageName = await fileUpload(("file_name=" + fileName) , pictureArray[0]);
        await putPlantstoDB(imageName);
        await loadPlantDataAPI(true);
        stateModal("success");
        selPage();
      }
    }else{
      stateModal("form");
      var name = [collectedPlantName];
      var pass = checkValidityForm(name, errDivModal[0]);
      if (pass) {
        stateModal("loading");
        plantModalStatus.innerHTML = `เพิ่มพืชสำเร็จ`
        var imageName = await fileUpload(("owner=" + ownerId) , pictureArray[0]);
        await postNewPlantstoDB(imageName);
        await loadPlantDataAPI(true);
        stateModal("success");
        selPage();
      }
    }
  });

  $("#save-plant-ac-btn").click(async () => {
    stateModal("form");
    var inputArr = [collectedActivity, collectedDuration];
    var pass = checkValidityForm(inputArr, errDivModal[1]);
    plantId = getPlantId();
    console.log(new Date());
    console.log(plantId);
    if (pass) {
      stateModal("loading");
      if (window.plantAcId) {
        await putEditActivity(plantId, window.plantAcId);
      } else {
        await postNewActivity(plantId);
      }
      await loadPlantDataAPI(true);
      stateModal("success");
      run();
    }
  });

  $("#del-plant-activity").click(async () => {
    plantId = getPlantId();
    if (window.delEvent == "activity") {
      if (window.plantAcId) {
        await deletePlantActivity(plantId, window.plantAcId);
        await loadPlantDataAPI(true);
        $("#modal-add-acplant").modal("toggle");
        stateModal("form");
        selPage();
      }
    } else {
      var deleted = await deletePlant(plantId);
      if (deleted) {
        deleteImage(plantObj.cover_image)
        await loadPlantDataAPI(deleted);
        $("#modal-add-acplant").modal("toggle");
        stateModal("form");
        window.history.back();
      } else {
        stateModal("success");
      }
    }
  });

  for (i = 0; i < ddDelPlant.length; i++) {
    ddDelPlant[i].onclick = function() {
      stateModal("delete");
      window.delEvent = "plant";
      $("#modal-add-acplant").modal("show");

      errText.innerHTML =
        '<center><h3 class="text-danger">คุณต้องการลบ "' +
        plantName +
        '" ใช่หรือไม่</h3><hr></center><p>&nbsp;&nbsp;โปรดทราบว่าหากคุณดำเนินการต่อ คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้อีก คุณยืนยันที่จะดำเนินการต่อหรือไม่</p>';
    };
  }
  for (i = 0; i < cancelModal.length; i++) {
    cancelModal[i].onclick = function() {
      stateModal("form");
    };
  }

  editPlantBtn.forEach(btn =>{
    btn.dataset.target = "#modal-add-plant";
    btn.onclick = () =>{
      collectedPlantName.value = plantName
      var filename = plantObj.cover_image;
      output.innerHTML = "";
    $("#input-plant-image").css("display", "block");

      if(filename){
        outputImageUI(headerImage + filename, filename);
        toImageFile(headerImage + filename, filename);
      }
    }
  })
}
//* switch page
async function selPage() {
  var allPlants = await loadPlantDataAPI(false);
  plantId = getPlantId();
  if (plantId.length == 24) {
    $("#plant-detail").show(500);
    window.onPage = "plant-detail";
    plant = allPlants.find(({ _id }) => _id === plantId);
    createPlanteDetailUI(plant);
  } else {
    $("#plant-list").show(500);
    window.onPage = "plant-list";
    createExitingPalntUI(allPlants);
  }
}

//*ทำตอนโหลดหน้า
async function run() {
  selPage();
  initBtn();
}

run()
  .then(() => {})
  .catch(err => console.log(err));
