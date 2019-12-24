var landNameDropdown = document.getElementById("land-dropdown");
var landNameFilter = document.getElementById("land-name-filter");

$(window, document).ready(function() {
  apiGetPlant();
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
      setCacheData("plants", JSON.stringify(docs));
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
      //docs return => {
      //     "land_id": [],
      //     "land_name": [],
      //     "address": [{
      //             "province": "kk",
      //             "district": [ "kk" ]}
      //     ],
      //     "plant": []
      // }
      var landName = docs.land_name;

      for (let i = 0; i < landName.length; i++) {
        var fName = document.createElement("a");
        fName.innerHTML = landName[i];
        fName.setAttribute("class", "dropdown-item");
        fName.setAttribute("role", "presentation");
        landNameDropdown.appendChild(fName);
        fName.onclick = (function(arg) {
          return function() {
            setFilterValueOnclick(arg);
          };
        })(landName[i]);
      }
    },
    function(e) {
      console.log(e.responseText);
    }
  );
}

function setFilterValueOnclick(value) {
  landNameFilter.innerHTML = value;
  if (value == "ทั้งหมด") {
    value = "all";
  }
  findLands("all", "all", value, "all");
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
    setMapAfFilter(docs);
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

