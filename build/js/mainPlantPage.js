var plantArray = []

window.onload = function() {
  var allPlants = JSON.parse(localStorage["plants"]);
  var plantCard = document.getElementById("plantCard");
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

