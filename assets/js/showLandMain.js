var defultLocation = {
  lat: 14.9780154,
  lng: 102.1029185
};
var drawingManager;
var controlUI;
var saveEditBt;
var clearBt;
var countButton = 0;
var geocoder;
var infowindow;
var map;

var ownerId = "5dfcabe6666c642250d2ec59";

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: defultLocation,
    zoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite"
  });

  var cacheLands = localStorage["lands"] || undefined;
  if (cacheLands != undefined) {
    getPolygonLands(JSON.parse(cacheLands));
  } else {
    getLatLngDB();
  }
}

function getLatLngDB() {
  var url = "/lands/" + ownerId;
  var body = "";
  var getAllLands = connectToServer(url, body, "GET");
  getAllLands.then(
    docs => {
      getPolygonLands(docs);
      setLandSession("lands", docs);
    },
    function(e) {
      // 404 owner not found
      console.log(e.responseText);
    }
  );
}

function getPolygonLands(docs) {
  // var cachePoly = localStorage["poly-lands-main"] || undefined;

  // if (cachePoly != undefined) {
  //   drawingPolygonLands(JSON.parse(cachePoly));
  //   for(let i = 0; i < docs.length; i++) {
      
  //   }

  // } else {
    var url = "/sec/lands/polygon/main";
    var body = JSON.stringify(docs);
    var polygonMain = connectToServer(url, body, "POST");
    polygonMain.then(poly => {
      drawingPolygonLands(poly);
     // setLandSession("poly-lands-main", poly);
    }),
      function(e) {
        console.log(e);
      };
 // }
}

function drawingPolygonLands(poly) {
  var polygonLands = poly.polygonLands;
  var bounds = new google.maps.LatLngBounds();

  for (let i = 0; i < polygonLands.length; i++) {
    var latlngInLand = polygonLands[i].lat_lng;
    new google.maps.Polygon({
      paths: latlngInLand,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    }).setMap(map);
    if (i == 0) {
      for (let j = 0; j < latlngInLand.length; j++) {
        bounds.extend(latlngInLand[j]);
      }
    }
  }
  map.fitBounds(bounds);
  map.setZoom(17.5);
}

function setLandSession(name, data) {
  //session
  //sessionStorage.lands = JSON.stringify(data);

  //cache

  localStorage[name] = JSON.stringify(data);

  //window.location.href = "detailland.html";
}
