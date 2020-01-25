var plantArray = []

window.onload = function() {
  var allPlants = JSON.parse(localStorage["plants"]);
  var plantCard = document.getElementById("plant-div");
  for(var i = 0; i < allPlants.length; i++){
    managerArray = allPlants[i].name

    var div = document.createElement("div")
    div.setAttribute("class", "col-md-4")
    var card = document.createElement("div")
    card.setAttribute("class", "card")
    var cardBody = document.createElement("div")
    cardBody.setAttribute("class", "card-body")

    var namePara = document.createElement("p")
    namePara.setAttribute("class", "perPlant")
    namePara.innerHTML = managerArray
    cardBody.appendChild(namePara)
    card.appendChild(cardBody)
    div.appendChild(card)
    plantCard.appendChild(div)
  }
}

var collectedPlantName = document.getElementById("plantName").value
var collectedPlantPicture = document.getElementById("plantPicUpload").value

function postNewPlants() {
console.log("ownerId" , ownerId)
  var url = "/plants/" + ownerId
  var body = JSON.stringify({
    name: collectedPlantName,
    cover_image: "0000"
  });
  var postNewPlants = connectToServer(url, body, "POST");
  postNewPlants.then(
    docs => {
      console.log("create new plant success " + docs)
    },
    function (e) {
      // 404 owner not found
      console.log(e.responseText);
    }
  );
}
