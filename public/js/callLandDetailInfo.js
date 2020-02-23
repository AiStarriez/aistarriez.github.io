var currentLand;
var currentLandInfo;
var currentPlant;
var currentPlantId;
var currentPlantInfo;
var currentOpCycle;
var landId;
var plantId;
var extendHeader = document.querySelectorAll("#extend-header");
var startOpBtn = document.querySelectorAll("#start-op-btn");
var harvestedBtn = document.querySelectorAll("#harvested-btn")
var hash = window.location.hash;
hash = hash.replace("#", "");


run();
async function getallLands() {
  var allLands = JSON.parse(localStorage["lands"]);
  currentLand = allLands.find(x => x.land._id === hash);
  console.log(currentLand.operation);
}

async function getallPlants() {
  var allPlants = JSON.parse(localStorage["plants"]);
  return allPlants
}

function displayActivity() {
  currentOpCycle = currentLand.operation
  var allActivities = currentOpCycle.logs.activities;
  var countAllActivity = 0;
  var notDoneActivity = 0;
  var inProgressActivity = 0;
  var doneActivity = 0;
  var lateActivity = 0;
  for (i = 0; i < allActivities.length; i++) {
    var eachActivity = allActivities[i];
    if (eachActivity.status == "ยังไม่เสร็จ") {
      notDoneActivity++;
    } else if (eachActivity.status == "กำลังดำเนินการ") {
      inProgressActivity++;
    } else if (eachActivity.status == "เสร็จแล้ว") {
      doneActivity++;
    } else if (eachActivity.status == "เลยกำหนด") {
      lateActivity++;
    }
    countAllActivity++;
  }
  $("#showAllActivity").append(countAllActivity);
  $("#showNotDoneActivity").append(notDoneActivity);
  $("#showInProgressActivity").append(inProgressActivity);
  $("#showDoneActivity").append(doneActivity);
  $("#showLateActivity").append(lateActivity);
}

function getPlantName(allPlant) {
  var plantNameDropdown = document.getElementById("plant-dropdown");
  var plantNameFilter = document.getElementById("plant-name-filter");

  for (i in allPlant) {
    var fName = document.createElement("a");
    fName.innerHTML = allPlant[i].name
    fName.setAttribute("class", "dropdown-item");
    fName.setAttribute("role", "presentation");
    plantNameDropdown.appendChild(fName);
    fName.onclick = (function (arg) {
      return function () {
        $("#modal-error-text").css("display", "none");
        plantNameFilter.innerHTML = arg;
        localStorage.landEmergency = landNameArr[arg];
      };
    })(allPlant[i].name);
  }
}


function selDisplay() {
  if (currentLand.operation.logs.plant_id) {
    harvestedBtn.forEach(btn => {
      btn.style.display = "block";
    })
    startOpBtn.forEach(btn => {
      btn.style.display = "none";
    })
    return true
  } else {
    harvestedBtn.forEach(btn => {
      btn.style.display = "none";
    })
    startOpBtn.forEach(btn => {
      btn.style.display = "block";
    })
    return false
  }
}

function initBtn() {
  $("#save-harvested-product").click(async () => {
    var harvestedDate = document.getElementById("harvested-date");
    var realProduct = document.getElementById("real-product");
    if (harvestedDate.value && realProduct.checkValidity()) {
      $("#err-div-modal").hide();
      var url = "/"
    } else {
      $("#err-div-modal").html("*กรุณากรอกข้อมูลให้ครบถ้วน")
      $("#err-div-modal").show();
    }
  });
}


async function run() {
  await getallLands();
  var data = selDisplay();
  var allPlants = await getallPlants();
  currentPlantId = currentLand.operation.logs.plant_id;
  currentPlant = allPlants.find(x => x._id === currentPlantId);
  getPlantName(allPlants);

  extendHeader.forEach(ex => {
    ex.innerHTML = currentLand.land.name
  })

  if (data) {
    $("#no-data-div").hide()
    $("#data-div").show()
    displayActivity();
    var landNameArr = document.querySelectorAll("#landNameTitle");
    for (i in landNameArr) {
      landNameArr[i].textContent = currentLand.land.name;
    }
    console.log("RUN")
    $("#landName").html(currentLand.land.name);
    $("#plant").html(currentPlant.name);
    $("#expProduct").html(currentLand.operation.logs.expected_product);
  } else {
    $("#no-data-div").show()
    $("#data-div").hide()
  }


}