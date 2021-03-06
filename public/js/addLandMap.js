var defultLocation = {
  lat: 16.472367,
  lng: 102.8234953
};
var drawingManager;
var controlUI;
var countMarker = [];
var geocoder;
var infowindow;
var map;
var polygonArr = [];
var province, district;
var polygonEditLand, landId;
var latlngResult = document.getElementById("latlngResult");
var landAreaInput = document.querySelectorAll("#landArea-input");
var landNameInput = document.querySelectorAll("#landName-input");

document.getElementById("search-location-form").onsubmit = function(e) {
  return false;
};

$("#mapSearchBt").click(function() {
  initSearchMap(document.getElementById("map_search").value);
  //console.log(initSearchMap($("#map_search").val()));
});
document.getElementById("map_search").onkeydown = function(e) {
  if (e.keyCode == 13) {
    initSearchMap(document.getElementById("map_search").value);
  }
};
$("#mapCleanBt").click(function() {
  localStorage.removeItem("polygonEditLand");
 landAreaInput.forEach(area =>{
   area.value = ""
 })
  landNameInput.forEach(name =>{
    name.value = ""
  })
  document.getElementById("latlngResult").innerHTML = "";
  initMap();
});

$("#toIndexBtn").click(function() {
  window.location = "index.html";
});

$("#modal-success").on("hidden.bs.modal", function() {
  window.location = "index.html";
});

$("#saveBtn").click(function() {
  $("#modal-default").modal("hide");
  $("#loader").html(loadingDiv())
  document.getElementById("modal-loading").style.display = "block";
    if (polygonEditLand != null) {
    apiAddLands("PUT", landId);
  } else {
    apiAddLands("POST", ownerId);
  }
});

$("#cancelBtn").click(() => {
  window.history.back();
});


// $('#modal-default').modal({backdrop: 'static', keyboard: false})
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: defultLocation,
    zoom: 17.5,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite",
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
    }
  });

  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow;


  var centerControlDiv = document.createElement('div');
  var centerControl = new currentLocationBtn(centerControlDiv, map);

  var saveCancel = document.createElement('div');
  var saveCancelDiv = new saveCancelBtn(saveCancel,map);

  centerControlDiv.index = 1;
  saveCancelBtn.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(saveCancel);


  addDrawingManager();
  polygonEditLand = localStorage.polygonEditLand;
  if (polygonEditLand != null) {
    polygonEditLand = JSON.parse(polygonEditLand);
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
      "</td></tr></table><hr>";
    latLngTocalc.push(new google.maps.LatLng(lat, lng));
  }
  defultLocation = polygonArr[0];
  var area = google.maps.geometry.spherical.computeArea(latLngTocalc);
  var areaThai = computeAreaThai(area)
  landAreaInput.forEach(areaInput =>{
    areaInput.value = areaThai
  })
}

function computeAreaThai(sqMeter){
  var rai = parseInt(sqMeter / 1600)
  var ngan = parseInt((sqMeter % 1600) / 400)
  var sqWa = parseInt(((sqMeter % 1600) % 400) / 4)

  return `${rai}-${ngan}-${sqWa}`
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
  map.setZoom(18.5);

  for (let i = 0; i < cacheLands.length; i++) {
    if (cacheLands[i].land._id == polygonEditLand.land_id) {
      landNameInput.forEach(name =>{
        name.value = cacheLands[i].land.name;
      })
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
      // console.log(results[0].geometry.location)

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
    name: landNameInput[0].value != "" ? landNameInput[0].value : landNameInput[1].value,
    province: province,
    district: district,
    area: landAreaInput[0].value,
    points: polygonArr
  };
  console.log(body);
  var url = "/lands/" + params;
  var postNewLand = connectToServer(url, JSON.stringify(body), typ);
  postNewLand.then(
    docs => {
      console.log(docs);
      setNewSession();
    },
    function(e) {
      if (e.status == 400) {
        //body ไม่ครบ หรือผิด
        console.log(e.responseText);
      } else if (e.status == 404) {
        //owner id ผิด
        console.log(e.responseText);
      } else if (e.status == 200) {
        setNewSession();
      } else {
        console.log(e);
      }
    }
  );
}

function setNewSession() {
  localStorage.removeItem("percent-lands");
  localStorage.removeItem("poly-lands-main");
  localStorage.removeItem("lands");
  document.getElementById("modal-loading").style.display = "none";
  $("#modal-success").modal("show");
}

// check modal visibility
var $div = $("#modal-success");

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.attributeName === "class") {
      var attributeValue = $(mutation.target).prop(mutation.attributeName);
      if (!attributeValue.includes("show")) {
        window.location = "index.html";
      }
    }
  });
});

observer.observe($div[0], {
  attributes: true
});
// check modal visibility

function clearMarker(countMarker) {
  for (i in countMarker) {
    countMarker[i].setMap(null);
  }
  countMarker = [];
}



function saveCancelBtn(controlDiv, map){

  controlDiv.innerHTML = '<button class="btn btn-primary" id="cancelBtn" onclick="window.history.back()" type="button">&nbsp; ยกเลิก &nbsp;</button><button id="modalSaveBtn" type="button" class="btn btn-primary" data-toggle="modal"data-target="#modal-default">&nbsp;บันทึก&nbsp;</button>'
  controlDiv.id = "button-div"
  controlDiv.style.fontFamily = "CS ChatThai"

}
