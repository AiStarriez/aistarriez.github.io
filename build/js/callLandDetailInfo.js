var currentLand
var currentLandInfo

function getallLands() {
  var allLands = JSON.parse(localStorage["lands"])
  console.log(sessionStorage.currentLandId)
  currentLand = allLands.find(x => x._id === sessionStorage.currentLand) 
  currentLandInfo = currentLand
  console.log(currentLandInfo)
} 
getallLands();
console.log(currentLandInfo.land.name)
$('#landName').append(currentLandInfo.land.name);
//$('#plant').append(currentLandInfo.land.name);
//$('#expProduct').append(currentLandInfo.land.name);

