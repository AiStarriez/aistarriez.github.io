var currentLand
var currentLandInfo
var currentPlant
var currentPlantId
var currentPlantInfo
var currentOpCycle
var landId
var plantId

function getallLands() {
  var allLands = JSON.parse(localStorage["lands"])
  console.log(sessionStorage.currentLandId)
  currentLand = allLands.find(x => x.land._id === sessionStorage.currentLandId) 
  console.log(currentLand)
  //console.log(currentLand.operation.logs.plant_id)
} 

function getallPlants(){
  var allPlants = JSON.parse(localStorage["plants"])
  currentPlantId = currentLand.operation.logs.plant_id
  currentPlant = allPlants.find(x => x._id === currentPlantId)
  console.log(currentPlant)
}

function callOpCyCle() {
  var url = "/operations/" + sessionStorage.currentLandId;
  var body = "";
  var getOpCycle = connectToServer(url, body, "GET");
  getOpCycle.then(
    docs => {
      setCacheData("operation_cycle", docs);
    },
    function(e) {
      // 404 owner not found
      console.log(e.responseText);
    }
  );
}

function displayActivity() {
  currentOpCycle = JSON.parse(localStorage["operation_cycle"])
  console.log(currentOpCycle)
  var allActivities = currentOpCycle.logs.activities
  console.log(allActivities)
  var countAllActivity = 0
  var notDoneActivity = 0
  var inProgressActivity = 0
  var doneActivity = 0
  var lateActivity = 0
  for (i=0; i < allActivities.length; i++){
    var eachActivity = allActivities[i]
    if(eachActivity.status == "ยังไม่เสร็จ"){
      notDoneActivity++
    } else if(eachActivity.status == "กำลังดำเนินการ"){
      inProgressActivity++
    } else if(eachActivity.status == "เสร็จแล้ว"){
      doneActivity++
    } else if(eachActivity.status == "เลยกำหนด"){
      lateActivity++
    }
    countAllActivity++
  }
  $('#showAllActivity').append(countAllActivity);
  $('#showNotDoneActivity').append(notDoneActivity);
  $('#showInProgressActivity').append(inProgressActivity);
  $('#showDoneActivity').append(doneActivity);
  $('#showLateActivity').append(lateActivity);
}


getallLands();
getallPlants();
callOpCyCle();
displayActivity();
//console.log(currentLandInfo.land.name)
$('#landNameTitle').append(currentLand.land.name);
$('#landName').append(currentLand.land.name);
$('#plant').append(currentPlant.name);
$('#expProduct').append(currentLand.operation.logs.expected_product);
//console.log(currentOpCycle);

