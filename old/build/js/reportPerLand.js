var landArray = []
var landNameArray = []

window.onload = function() {
  var allLands = JSON.parse(localStorage["lands"]);
  var reportPerLandDiv = document.getElementById("reportPerLandDiv");
  for(var i = 0; i < allLands.length; i++){
    landNameArray = allLands[i].land.name

    var div = document.createElement("div")
    div.setAttribute("class", "col-md-4")
    var card = document.createElement("div")
    card.setAttribute("class", "card")
    var cardBody = document.createElement("div")
    cardBody.setAttribute("class", "card-body")

    var namePara = document.createElement("p")
    namePara.setAttribute("class", "perLand")
    namePara.innerHTML = landNameArray
    cardBody.appendChild(namePara)
    card.appendChild(cardBody)
    div.appendChild(card)
    reportPerLandDiv.appendChild(div)
  }
}


