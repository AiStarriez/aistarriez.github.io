var landNameDropdown = document.getElementById("land-dropdown");
var landNameFilter = document.getElementById("land-name-filter");
var plantDropdown = document.getElementById("plant-dropdown");
var plantFilter = document.getElementById("plant-filter");

window.province = "all";
window.district = "all";
window.land = "all";
window.plant = "all";

$(window, document).ready(function() {
  apiGetPlant();
  sessionStorage.removeItem("authenEvent")
});

function apiGetPlant() {
  var cachePlant = localStorage["plants"] || undefined;
  if (cachePlant != undefined) {
     filterLands();
  } else {
    var url = "/plants/" + ownerId;
    var body = "";
    var getAllPlant = connectToServer(url, body, "GET");
    getAllPlant.then(docs => {
      setCacheData("plants", docs);
       filterLands();
    });
  }
}

function filterLands() {
  var url = "/lands/filter/" + ownerId;
  var body = "";

  var getFilters = connectToServer(url, body, "GET");
  getFilters.then(
    docs => {
      var landName = docs.land_name;
      var plantName = docs.plant;
      for (let i = 0; i < landName.length; i++) {
        var fName = document.createElement("a");
        fName.innerHTML = landName[i];
        fName.setAttribute("class", "dropdown-item");
        fName.setAttribute("role", "presentation");
        landNameDropdown.appendChild(fName);
        fName.onclick = (function(arg) {
          return function() {
            setFilterValueOnclick("ที่ดิน", arg);
          };
        })(landName[i]);
      }
      for (let i = 0; i < plantName.length; i++) {
        var fName = document.createElement("a");
        fName.innerHTML = plantName[i];
        fName.setAttribute("class", "dropdown-item");
        fName.setAttribute("role", "presentation");
        plantDropdown.appendChild(fName);
        fName.onclick = (function(arg) {
          return function() {
            setFilterValueOnclick("พืช", arg);
          };
        })(plantName[i]);
      }
    },
    function(e) {
      console.log(e.responseText);
    }
  );
}

function setFilterValueOnclick(type, value) {
  console.log(value);
  if (type == "ที่ดิน") {
    window.land = value;
    landNameFilter.innerHTML = value;
  } else if (type == "พืช") {
    window.plant = value;
    plantFilter.innerHTML = value;
  } else if (type == "จังหวัด") {
  } else if (type == "อำเภอ") {
  }

  findLands(window.province, window.district, window.land, window.plant);
}

function findLands(province, district, landName, plant) {
  //var landsData = JSON.parse(sessionStorage.lands);
  var landsData = JSON.parse(localStorage["lands"]) || undefined;
  var plantData = JSON.parse(localStorage["plants"]) || undefined;

  var url =
    "/sec/lands/filter?province=" +
    province +
    "&district=" +
    district +
    "&landname=" +
    landName +
    "&plant=" +
    plant;
  var body = JSON.stringify({ lands: landsData, plants: plantData });
  var filterLand = connectToServer(url, body, "POST");
  filterLand.then(docs => {

    var landIdArr = [];
    for (let i = 0; i < docs.length; i++) {
      landIdArr.push(docs[0]);
    }
    console.log(landIdArr);
    setMapAfFilter(landIdArr);
  }),
    function(e) {
      console.log(e);
    };
}

function setMapAfFilter(afFilters) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: defultLocation,
    zoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite"
  });
  getPolygonLands(afFilters);
}

$("#hamburger").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

$("#addLandBtn").click(function(e) {
  e.preventDefault();
  sessionStorage.removeItem("polygonEditLand");
  window.location = "addland.html";
});
