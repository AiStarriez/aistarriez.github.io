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

var contentString =
  '<div><p>ทดสอบ</p><a href="addLandPage.html">แก้ไข</a></div>';

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

  infowindow = new google.maps.InfoWindow({
    content: contentString
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
      setCacheData("lands", docs);
    },
    function(e) {
      // 404 owner not found
      console.log(e.responseText);
    }
  );
}

function getPolygonLands(docs) {
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
  var l;
  for (let i = 0; i < polygonLands.length; i++) {
    var latlngInLand = polygonLands[i].lat_lng;
    l = new google.maps.Polygon({
      paths: latlngInLand,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    }).setMap(map);

    var marker = new google.maps.Marker({
      position: polygonLands[i].center,
      title: "Hello World!",
      description: polygonLands[i],
      icon: createMarker(25, 25, 4),
      map: map
    });

    google.maps.event.addListener(
      marker,
      "click",
      (function(marker, i) {
        return function() {
          var context =
            "<div><p>" +
            polygonLands[i].land_id +
            '</p><a href="addLandPage.html">แก้ไข</a></div>';
          infowindow.setContent(context);
          infowindow.open(map, marker);
          sessionStorage.polygonEditLand = JSON.stringify(marker.description);
        };
      })(marker, i)
    );

    if (i == 0) {
      for (let j = 0; j < latlngInLand.length; j++) {
        bounds.extend(latlngInLand[j]);
      }
    }
  }
  map.fitBounds(bounds);
  map.setZoom(17.5);
}

function addListenersOnPolygon(polygon) {
  google.maps.event.addListener(polygon, "click", function(event) {
    alert(polygon.indexID);
  });
}

function createMarker(width, height, radius) {
  var canvas, context;

  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d");

  context.clearRect(0, 0, width, height);

  // background is yellow
  context.fillStyle = "rgba(255,255,0,1)";

  // border is black
  context.strokeStyle = "rgba(0,0,0,1)";

  context.beginPath();
  context.moveTo(radius, 0);
  context.lineTo(width - radius, 0);
  context.quadraticCurveTo(width, 0, width, radius);
  context.lineTo(width, height - radius);
  context.quadraticCurveTo(width, height, width - radius, height);
  context.lineTo(radius, height);
  context.quadraticCurveTo(0, height, 0, height - radius);
  context.lineTo(0, radius);
  context.quadraticCurveTo(0, 0, radius, 0);
  context.closePath();

  context.fill();
  context.stroke();

  return canvas.toDataURL();
}
