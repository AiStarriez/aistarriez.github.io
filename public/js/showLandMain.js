var defultLocation = {
  lat: 14.9780154,
  lng: 102.1029185
};
var countButton = 0;
var geocoder, infowindow, map, cacheLands;
var markerArr = [];
var divArr = [];
var canvasArr = {};
var couterMarker = 0;
var colorPieArr = ["#FFE098", "#BAFF96", "#88EFFF", "#9BC2FF", "#FF999D"];
var mapPolyPieColor = [];
localStorage.removeItem("polygonEditLand");
var contentString =
  '<div><p>ทดสอบ</p><a href="addLandPage.html">แก้ไข</a></div>';

$("#loader").html(loadingDiv())
document.getElementById("modal-loading").style.display = "block";

async function initMap() {
  var landsPercent = localStorage["percent-lands"] || undefined;
  cacheLands = localStorage["lands"] || undefined;

  if (landsPercent != undefined && cacheLands) {
    cacheLands = JSON.parse(cacheLands)
    await loopCreatePie(landsPercent, cacheLands);
  } else {
    cacheLands = await getCacheLands(cacheLands);
    if (cacheLands) {
      await getPercentOpCycle(cacheLands);
      location.reload();
    } else {
      blankMap()
      document.getElementById("widget").style.display = "none";
      document.getElementById("img-out").style.display = "none";
      document.getElementById("modal-loading").style.display = "none";
    }
  }
}

async function loopCreatePie(landsPercent, cacheLands) {
  couterMarker = 0
  landsPercent = JSON.parse(landsPercent);
  divArr = []

  for (let i = 0; i < cacheLands.length; i++) {
    var findLand = landsPercent.find(x => x.land_id == cacheLands[i].land._id)
    var percent = findLand.percent || 0;
    percent = parseInt(percent)
    findLand.land_name = cacheLands[i].land.name;
    findLand.percent = percent;
    createPie(findLand, i % 5);
  }
  toCanvasMarker(divArr);
}

async function getCacheLands() {
  var cacheLands = await getLatLngDB();
  if (cacheLands != null) {
    localStorage.lands = JSON.stringify(cacheLands);
  } else {
    return null
  }
  return cacheLands;
}

async function getPercentOpCycle(cacheLands) {
  try {
    var body = {
      qland: getLandsID(cacheLands)
    };
    var typ = "POST";
    var url = "/operations/percent";
    var getPercent = await connectToServer(url, JSON.stringify(body), typ);
    localStorage['percent-lands'] = JSON.stringify(getPercent);
    return getPercent;
  } catch (err) {
    console.log(err);
  }
}

function getLandsID(cacheLands) {
  var landID = [];
  for (var i = 0; i < cacheLands.length; i++) {
    var id = {
      land_id: cacheLands[i].land._id
    };
    landID.push(id);
  }
  return landID;
}

async function createMap(cacheLands) {
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
  geocoder = new google.maps.Geocoder();


  var centerControlDiv = document.createElement('div');
  var centerControl = new currentLocationBtn(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

  var getpolyDB = await getPolygonLands(cacheLands);
  createMapComponent(getpolyDB, cacheLands);
  drawingPolygonLands(getpolyDB, null);
}

function blankMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: defultLocation,
    zoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite"
  });

}

async function getLatLngDB() {
  try {
    var url = "/lands/" + ownerId;
    var body = "";
    var getAllLands = await connectToServer(url, body, "GET");
    return getAllLands;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getPolygonLands(cacheLands) {

  try {
    var url = "/sec/lands/polygon/main";
    var body = JSON.stringify(cacheLands);
    var getPoly = await connectToServer(url, body, "POST");
    poly = getPoly.polygonLands
    localStorage["poly-lands-main"] = JSON.stringify(poly)
  } catch (err) {
    console.log(err)
  }

  return poly
}

function getPlantsActivity(cacheLandsIndex, activityID) {
  var plants = JSON.parse(localStorage["plants"]);
  var plantName, task;
  for (let k = 0; k < plants.length; k++) {
    var plantActivities = plants[k].activities;
    if (cacheLandsIndex.operation.logs.plant_id == plants[k]._id) {
      plantName = plants[k].name;
    }
    if (activityID != undefined) {
      var id = activityID._id;
      for (let i = 0; i < plantActivities.length; i++) {
        if (id == plantActivities[i]._id) {
          task = plantActivities[i].tasks;
        }
      }
    }
  }
  return {
    plantName,
    task
  };
}

function createMapComponent(poly, cacheLands) {
  mapPolyPieColor = [];
  var polygonLands = poly;
  var l;
  try {
    cacheLands = JSON.parse(cacheLands)
  } catch (err) {}

  polygonLands.forEach((polygon, i) => {
    var land = cacheLands.find(cache => cache.land._id == polygon.land_id);
    var activities = land.operation.logs.activities;
    activities.sort(dynamicSort("status"));
    var lastActivity = null;
    try {
      lastActivity = activities[activities.length - 1].task;
    } catch (err) {}

    var activityID = activities[activities.length - 1];

    plantObj = getPlantsActivity(land, activityID);
    var plantName = plantObj.plantName || "ยังไม่ปลูกพืช";
    if (lastActivity == null || lastActivity == undefined) {
      lastActivity = plantObj.task || "ไม่มีกิจกรรม";
    } else {
      lastActivity = activities[activities.length - 1].task;
    }

    var latlngInLand = polygon.lat_lng;
    l = new google.maps.Polygon({
      paths: latlngInLand,
      strokeColor: colorPieArr[i % 5],
      strokeOpacity: 0.6,
      strokeWeight: 4,
      fillColor: colorPieArr[i % 5],
      fillOpacity: 0.6
    });
    var popupMap =
      "<h5>" +
      land.land.name +
      "</h5><p>พืช : " +
      plantName +
      "</p><p>กิจกรรมล่าสุด : " +
      lastActivity +
      '</p><hr><a href="landDetail.html#' +
      land.land._id +
      '">ดูแบบละเอียด</a><br>';
      popupMap += localStorage.role == "owner"? ('<a href="addland.html#' +
      land.land._id +
      '">แก้ไขขนาด</a>') : '<br>'
    var obj = {
      land_id: polygon.land_id,
      poly: l,
      pie: canvasArr[polygon.land_id],
      position: polygon.center,
      popup: popupMap
    };
    mapPolyPieColor.push(obj);
  })

}

async function drawingPolygonLands(poly, landArr) {
  var polygonLands = poly;
  var bounds = new google.maps.LatLngBounds();
  var l;
  if (landArr == null) {
    landArr = [];
    for (let i = 0; i < polygonLands.length; i++) {
      landArr.push(polygonLands[i].land_id);
    }
  }

  for (let i = 0; i < mapPolyPieColor.length; i++) {
    var latlngInLand = polygonLands[i].lat_lng;
    for (let j = 0; j < landArr.length; j++) {
      if (landArr[j] == mapPolyPieColor[i].land_id) {
        l = mapPolyPieColor[i].poly;
        l.setMap(map);
        var marker = new google.maps.Marker({
          position: mapPolyPieColor[i].position,
          description: polygonLands[i],
          icon: mapPolyPieColor[i].pie,
          map: map
        });
        markerArr.push(marker);

        google.maps.event.addListener(
          marker,
          "click",
          (function (marker, i) {
            return function () {
              var context = "<div>" + mapPolyPieColor[i].popup + "</div>";
              infowindow.setContent(context);
              infowindow.open(map, marker);
              localStorage.polygonEditLand = JSON.stringify(
                marker.description
              );
            };
          })(marker, i)
        );
        if (j == 0) {
          for (let j = 0; j < latlngInLand.length; j++) {
            bounds.extend(latlngInLand[j]);
          }
        }
      }
    }
  }
  map.fitBounds(bounds);
  map.setZoom(17.5);
}

function addListenersOnPolygon(polygon) {
  google.maps.event.addListener(polygon, "click", function (event) {
    alert(polygon.indexID);
  });
}

async function createPie(landPercent, color) {
  var parent = document.createElement("div");
  var widget = document.getElementById("widget");
  var pie = document.createElement("div");
  var number = document.createElement("input");
  var landName = document.createElement("div")
  pie.className = "pie-div"
  pie.style.display = "inline";
  pie.style.width = "90px";
  pie.style.height = "90px";
  landName.innerHTML = landPercent.land_name
  landName.style.textAlign = "center"
  landName.style.color = "white"
  number.type = "text";
  number.className = "knob pie-chart"
  number.value = landPercent.percent;
  number.setAttribute("data-width", "90");
  number.setAttribute("data-height", "90");
  number.setAttribute("data-fgcolor", colorPieArr[color]);
  number.setAttribute("data-readonly", "true");
  number.setAttribute("readonly", "readonly");
  pie.appendChild(number);
  parent.appendChild(pie);
  widget.appendChild(parent);
  divArr.push({
    div: parent,
    id: landPercent.land_id
  });
}

async function toCanvasMarker(divArr) {
  try {
    if (couterMarker < divArr.length) {
      html2canvas(divArr[couterMarker].div, {
        onrendered: function (canvas) {
          $("#img-out").append(canvas);
          canvasArr[divArr[couterMarker].id] = canvas.toDataURL();
          couterMarker++;
          toCanvasMarker(divArr);
        },
        onerror: function(){
          localStorage.removeItem("percent-lands")
          location.reload();
        }
      })
    } else {
      document.getElementById("widget").style.display = "none";
      document.getElementById("img-out").style.display = "none";
      var init = await createMap(cacheLands);
      document.getElementById("modal-loading").style.display = "none";
    }
  } catch (err) {
    location.reload();
  }

}