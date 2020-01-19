var defultLocation = {
  lat: 14.9780154,
  lng: 102.1029185
};
var countButton = 0;
var geocoder, infowindow, map, cacheLands;
var markerArr = [];
var divArr = [];
var canvasArr = [];
var couterMarker = 0;
var colorPieArr = ["#F76647", "#319CBE", "#40253D", "#0A3B9A", "#F2404C"];
var mapPolyPieColor = [];
sessionStorage.removeItem("polygonEditLand");
var contentString =
  '<div><p>ทดสอบ</p><a href="addLandPage.html">แก้ไข</a></div>';

var ownerId = "5dfcabe6666c642250d2ec59";

async function initMap() {
  var landsPercent = localStorage["percent-lands"] || undefined;
  cacheLands = localStorage["lands"] || undefined;
  if (landsPercent != undefined) {
    await loopCreatePie(landsPercent);
  } else {
    cacheLands = await getCacheLands(cacheLands);
    await getPercentOpCycle(cacheLands);
    
  }
}

async function loopCreatePie(landsPercent) {
  landsPercent = JSON.parse(landsPercent);
  for (let i = 0; i < landsPercent.length; i++) {
    var percent = landsPercent[i].percent || 0;
    createPie(percent, i);
  }
  toCanvasMarker(divArr);
}

async function getCacheLands(cacheLands) {
  if (cacheLands == undefined) {
    cacheLands = await getLatLngDB();
    setCacheData("lands", cacheLands);
    location.reload();
  } else {
    cacheLands = JSON.parse(cacheLands);
  }
  return cacheLands;
}

async function getPercentOpCycle(cacheLands) {
  try {
    var body = { qland: getLandsID(cacheLands) };
    var typ = "POST";
    var url = "/operations/percent";
    var getPercent = await connectToServer(url, JSON.stringify(body), typ);
    setCacheData("percent-lands", getPercent);
    location.reload();
    return getPercent;
  } catch (err) {
    console.log(err);
  }
}

function getLandsID(cacheLands) {
  var landID = [];
  for (var i = 0; i < cacheLands.length; i++) {
    var id = { land_id: cacheLands[i].land._id };
    landID.push(id);
  }
  return landID;
}

function createMap(cacheLands) {
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
  getPolygonLands(null);
}

async function getLatLngDB() {
  try {
    var url = "/lands/" + ownerId;
    var body = "";
    var getAllLands = await connectToServer(url, body, "GET");
    return getAllLands;
  } catch (err) {
    console.log(err);
  }
}

async function getPolygonLands(landArr) {
  var getCachePoly = localStorage["poly-lands-main"] || undefined;
  if (getCachePoly !== undefined) {
    getCachePoly = JSON.parse(getCachePoly);
    createMapComponent(getCachePoly, cacheLands);
    drawingPolygonLands(getCachePoly, landArr);
  } else {
    var url = "/sec/lands/polygon/main";
    var body = JSON.stringify(cacheLands);
    var polygonMain = connectToServer(url, body, "POST");
    polygonMain.then(poly => {
      setCacheData("poly-lands-main", poly);
      createMapComponent(poly, cacheLands);
      drawingPolygonLands(poly, landArr);
    }),
      function(e) {
        console.log(e);
      };
  }
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
  return { plantName, task };
}

function createMapComponent(poly, cacheLands) {
  mapPolyPieColor = [];
  var polygonLands = poly.polygonLands;
  var l;
  for (let i = 0; i < polygonLands.length; i++) {
    for (let j = 0; j < cacheLands.length; j++) {
      if (polygonLands[i].land_id == cacheLands[j].land._id) {
        var activities = cacheLands[j].operation.logs.activities;
        activities.sort(dynamicSort("status"));
        var lastActivity = null;
        try {
          lastActivity = activities[activities.length - 1].task;
        } catch (err) {}

        var activityID = activities[activities.length - 1];

        plantObj = getPlantsActivity(cacheLands[j], activityID);
        var plantName = plantObj.plantName || "ยังไม่ปลูกพืช";
        if (lastActivity == null || lastActivity == undefined) {
          lastActivity = plantObj.task || "ไม่มีกิจกรรม";
        } else {
          lastActivity = activities[activities.length - 1].task;
        }

        var latlngInLand = polygonLands[i].lat_lng;
        l = new google.maps.Polygon({
          paths: latlngInLand,
          strokeColor: colorPieArr[i],
          strokeOpacity: 0.6,
          strokeWeight: 2,
          fillColor: colorPieArr[i],
          fillOpacity: 0.35
        });
        var popupMap =
          "<h5>" +
          cacheLands[j].land.name +
          "</h5><p>พืช : " +
          plantName +
          "</p><p>กิจกรรมล่าสุด : " +
          lastActivity +
          '</p><hr><a href="landDetai.html#' +
          cacheLands[j].land._id +
          '">ดูแบบละเอียด</a><br><a href="addland.html#' +
          cacheLands[j].land._id +
          '">แก้ไขขนาด</a>';
        var obj = {
          land_id: polygonLands[i].land_id,
          poly: l,
          pie: canvasArr[i],
          position: polygonLands[i].center,
          popup: popupMap
        };
        mapPolyPieColor.push(obj);
        // }
      }
    }
  }
}

async function drawingPolygonLands(poly, landArr) {
  var polygonLands = poly.polygonLands;
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
          title: "Hello World!",
          description: polygonLands[i],
          icon: mapPolyPieColor[i].pie,
          map: map
        });
        markerArr.push(marker);

        google.maps.event.addListener(
          marker,
          "click",
          (function(marker, i) {
            return function() {
              var context = "<div>" + mapPolyPieColor[i].popup + "</div>";
              infowindow.setContent(context);
              infowindow.open(map, marker);
              sessionStorage.polygonEditLand = JSON.stringify(
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
  google.maps.event.addListener(polygon, "click", function(event) {
    alert(polygon.indexID);
  });
}

async function createPie(percent, color) {
  var parent = document.createElement("div");
  var widget = document.getElementById("widget");
  var pie = document.createElement("div");
  var canvas = document.createElement("canvas");
  var number = document.createElement("input");
  pie.style.display = "inline";
  pie.style.width = "90px";
  pie.style.height = "90px";
  parent.style.paddingTop = "10px";
  canvas.width = 112;
  canvas.height = 112;
  canvas.style.width = "90px";
  canvas.style.height = "90px";
  number.type = "text";
  number.setAttribute("class", "knob");
  number.value = percent;
  number.setAttribute("data-width", "90");
  number.setAttribute("data-height", "90");
  number.setAttribute("data-fgcolor", colorPieArr[color]);
  number.setAttribute("data-readonly", "true");
  number.setAttribute("readonly", "readonly");
  number.style.width = "49px";
  number.style.height = "30px";
  number.style.position = "absolute";
  number.style.verticalAlign = "middle";
  number.style.marginTop = "30px";
  number.style.marginLeft = "-69px";
  number.style.border = "0px none";
  number.style.background = "#000000";
  // pie.appendChild(canvas);
  pie.appendChild(number);
  parent.appendChild(pie);
  widget.appendChild(parent);
  divArr.push(parent);
}

async function toCanvasMarker(divArr) {
  if (couterMarker < divArr.length) {
    await html2canvas(divArr[couterMarker], {
      onrendered: function(canvas) {
        $("#img-out").append(canvas);
        canvasArr.push(canvas.toDataURL());
        couterMarker++;
        toCanvasMarker(divArr);
      }
    });
  } else {
    document.getElementById("widget").style.display = "none";
    document.getElementById("img-out").style.display = "none";
    cacheLands = await getCacheLands(cacheLands);
    var init = await createMap(cacheLands);
  }
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
