var defultLocation = {
  lat: 16.472367,
  lng: 102.8234953
};
var drawingManager;
var controlUI;
var saveEditBt;
var clearBt;
var countButton = 0;
var geocoder;
var infowindow;
var map;
var polygonArr = [];
var province, district;
var polygonEditLand, landId;
var latlngResult = document.getElementById("latlngResult");
var landAreaInput = document.getElementById("landArea-input");
var landNameInput = document.getElementById("landName-input");

$("#mapSearchBt").click(function() {
  initSearchMap($("#map_search").val());
});
$("#mapCleanBt").click(function() {
  initMap();
});
$("#saveBtn").click(function() {
  if (polygonEditLand != null) {
    apiAddLands("PUT", landId);
  } else {
    apiAddLands("POST", params);
  }
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: defultLocation,
    zoom: 17.5,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite"
  });

  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow();

  addDrawingManager();
  polygonEditLand = JSON.parse(sessionStorage.polygonEditLand);
  if (polygonEditLand != null) {
    editSetPolygon(polygonEditLand);
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.FALSE);
    getProvinceDistrict(geocoder, polygonArr[0]);
  }

  google.maps.event.addListener(drawingManager, "polygoncomplete", function(
    polygon
  ) {
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.FALSE);
    onPolygonDrag(polygon);
    getProvinceDistrict(geocoder, polygonArr[0]);
    setPolygonEvt(polygon);
    //
  });
}

function setPolygonEvt(polygon) {
  google.maps.event.addListener(polygon.getPath(), "insert_at", function(evt) {
    onPolygonDrag(polygon);
  });
  google.maps.event.addListener(polygon.getPath(), "set_at", function(evt) {
    onPolygonDrag(polygon);
  });
}

function onPolygonDrag(polygon) {
  var polygonBounds = polygon.getPath();
  var latLngTocalc = [];
  latlngResult.innerHTML = "";
  polygonArr = [];

  for (var i = 0; i < polygonBounds.length; i++) {
    var lat = polygonBounds.getAt(i).lat();
    var lng = polygonBounds.getAt(i).lng();
    polygonArr.push({ lat: lat, lng: lng });
    latlngResult.innerHTML =
      latlngResult.innerHTML +
      "<table><tr><td>จุดที่ " +
      (i + 1) +
      "</td></tr><tr><td>ละติจูด</td><td>" +
      lat +
      "</td></tr><tr><td>ลองจิจูด</td><td>" +
      lng +
      "</td></tr></table>";
    latLngTocalc.push(new google.maps.LatLng(lat, lng));
  }
  defultLocation = polygonArr[0];
  var area = google.maps.geometry.spherical.computeArea(latLngTocalc);
  landAreaInput.value = area.toFixed(2);
}

function editSetPolygon(polygonEditLand) {
  var bounds = new google.maps.LatLngBounds();
  var cacheLands = JSON.parse(localStorage["lands"]) || undefined;
  var poly = new google.maps.Polygon({
    paths: polygonEditLand.lat_lng,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });
  poly.setMap(map);
  poly.setEditable(true);
  setPolygonEvt(poly);
  onPolygonDrag(poly);
  for (let j = 0; j < polygonEditLand.lat_lng.length; j++) {
    bounds.extend(polygonEditLand.lat_lng[j]);
  }
  map.fitBounds(bounds);
  map.setZoom(17.5);

  for (let i = 0; i < cacheLands.length; i++) {
    if (cacheLands[i].land._id == polygonEditLand.land_id) {
      landNameInput.value = cacheLands[i].land.name;
      landId = cacheLands[i].land._id;
      break;
    }
  }
}

function initSearchMap(inputQuery) {
  infowindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();
  var request = {
    query: inputQuery,
    fields: ["name", "geometry"]
  };
  var service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      //  createMarker(results[i]);
      console.log(results[0].geometry.location);
      var marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map
      });
      defultLocation = results[0].geometry.location;
      initMap();
      //   map.setCenter(results[0].geometry.location);
    }
  });
}

function addDrawingManager() {
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: false,
    polygonOptions: {
      editable: true,
      strokeColor: "red",
      strokeOpacity: 1.0,
      strokeWeight: 3,
      fillColor: "red"
    }
  });

  drawingManager.setMap(map);
}

function getProvinceDistrict(geocoder, getlatlng) {
  var latlng = getlatlng;
  geocoder.geocode({ location: latlng }, function(results, status) {
    if (status === "OK") {
      if (results[0]) {
        var address_components = results[0].address_components;
        for (let i = 0; i < address_components.length; i++) {
          var types = address_components[i].types;
          if (types.includes("administrative_area_level_2")) {
            district = address_components[i].short_name;
          } else if (types.includes("administrative_area_level_1")) {
            province = address_components[i].short_name;
            break;
          }
        }
        console.log("province", province, "district", district);
      } else {
        console.log("No results found");
      }
    } else {
      console.log("Geocoder failed due to: " + status);
    }
  });
}

function apiAddLands(typ, params) {
  var body = {
    name: landNameInput.value,
    province: province,
    district: district,
    area: landAreaInput.value,
    points: polygonArr
  };
  console.log(body);
  var url = "/lands/" + params;
  var postNewLand = connectToServer(url, JSON.stringify(body), typ);
  postNewLand.then(
    docs => {
      console.log(docs);
      getLatLngDB();
    },
    function(e) {
      if (e.status == 400) {
        //body ไม่ครบ หรือผิด
        console.log(e.responseText);
      } else if (e.status == 404) {
        //owner id ผิด
        console.log(e.responseText);
      }
    }
  );
}

function getLatLngDB() {
  var url = "/lands/" + ownerId;
  var body = "";
  var getAllLands = connectToServer(url, body, "GET");
  getAllLands.then(
    docs => {
      setCacheData("lands", docs);
    },
    function(e) {
      // 404 owner not found
      console.log(e);
    }
  );
}
