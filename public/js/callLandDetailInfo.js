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
  if (localStorage["lands"]) {
    var allLands = JSON.parse(localStorage["lands"]);
  } else {
    try {
      var url = `/lands/${ownerId}`
      var allLands = await connectToServer(url, "", "GET");
      localStorage.lands = JSON.stringify(allLands)
    } catch (err) {
      console.log(err)
    }
  }
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
    if (eachActivity.status.includes("ไม่")) {
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
        window.plantSel = null
        $("#modal-error-text").css("display", "none");
        plantNameFilter.innerHTML = arg.name;
        window.plantSel = arg
      };
    })(allPlant[i]);
  }
}

async function startCycleAPI(plantId, expected_product) {
  try {
    var url = `/operations/start/${currentLand.land._id}?id=${ownerId}`;
    var body = {
      plant: plantId,
      start_date: new Date().toISOString(),
      expected_product: expected_product
    }
    console.log(url)
    var startCycle = await connectToServer(url, JSON.stringify(body), "POST");
    localStorage.removeItem('lands');
    run()
    $("#modal-start").modal('hide')
  } catch (err) {
    console.log(err)
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
      var harvDate = harvestedDate.value.split("/")
      harvDate[2] -= 543
      var endDate = new Date(`${harvDate[2]}-${harvDate[1]}-${harvDate[0]}`).toISOString();

      try{
        var url = "/operations/harvested/" + currentLand.land._id;
        var body = {end_date : endDate , real_product : parseInt(realProduct.value)}
        var harvested = await connectToServer(url , JSON.stringify(body) , "POST");
        console.log("success")
      }catch(err){
        console.log(err)
        if(err.status == 200){

        }
      }

    } else {
      $("#err-div-modal").html("*กรุณากรอกข้อมูลให้ครบถ้วน")
      $("#err-div-modal").show();
    }
  });

  $("#save-start-cycle").click(async () => {
    var plantSel = window.plantSel
    var expected_product = document.getElementById("expect-product");
    if (plantSel && expected_product.checkValidity()) {
      $("#modal-error-text").css("display", "none");
      startCycleAPI(plantSel._id, parseInt(expected_product.value))
    } else {
      $("#modal-error-text").css("display", "block");
    }
  })
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

initBtn()