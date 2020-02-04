function initBtn() {}
function selectPage(landId) {
  if (landId.length == 24) {
    $("#container-report-list").hide(500);
    $("#header-report-list").hide();
    $("#container-report-perland").show(500);
    $("#header-report-detail").show();
    document.querySelectorAll("#export-csv-btn").forEach(el => {
      el.style.display = "block";
    });
  } else {
    $("#container-report-perland").hide(500);
    $("#header-report-detail").hide();
    $("#container-report-list").show(500);
    $("#header-report-list").show();
    document.querySelectorAll("#export-csv-btn").forEach(el => {
      el.style.display = "none";
    });
  }
}
async function getLandDetail() {
  var lands = localStorage.lands;
  if (lands) {
    lands = JSON.parse(lands);
  } else {
    try {
      url = `/lands/${ownerId}`;
      var landsData = await connectToServer(url, "", "GET");
      lands = landsData;
      localStorage.lands = JSON.stringify(lands);
    } catch (err) {
      console.log(err);
    }
  }
  if (lands.length == 0 || !lands) {
    return false;
  }
  return lands;
}
async function getImagePolyLand(lands) {
  var polygonLands = localStorage["poly-lands-main"];
  var imgTagArr = [];
  if (polygonLands) {
    polygonLands = JSON.parse(polygonLands);
  } else {
    try {
      var url = "/sec/lands/polygon/main";
      var body = JSON.stringify(lands);
      var polygonMain = await connectToServer(url, body, "POST");
      polygonLands = polygonMain.polygonLands;
      localStorage["poly-lands-main"] = JSON.stringify(polygonLands);
    } catch (err) {
      console.log(err);
    }
  }

  polygonLands.forEach(polygon => {
    var img = `<img class="myImg" style="width:250px;height:250px;" src="https://maps.googleapis.com/maps/api/staticmap?center=${polygon.center.lat}, ${polygon.center.lng}&zoom=18&path=color:0xff0000ff%7Cweight:0%7Cfillcolor:0x0000ff80`;
    polygon.lat_lng.forEach(position => {
      img += `%7C${position.lat},${position.lng}`;
    });
    img += `&size=300x300&maptype=satellite&key=${googleMapApiKey}">`;
    imgTagArr.push(img);
  });
  return imgTagArr;
}

function getLandIdFromURL() {
  var url = window.location.toString();
  var landIndex = url.indexOf("land=") + 5;
  var landId = url.substring(landIndex, url.length);
  return landId;
}
function createReportListUI(lands, polyImage) {
  history.pushState({ page: 1 }, "main", "");
  var reportList = document.getElementById("container-report-list");
  if (!lands) {
    reportList.innerHTML =
      '<center style="color:grey"><h2>ยังไม่เพิ่มที่ดิน</h2></center>';
    return false;
  }
  for (i in lands) {
    var name = lands[i].land.name;
    var id = lands[i].land._id;
    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.marginRight = "14px";
    div.style.marginBottom = "14px";
    div.style.cursor = "pointer";
    var children = document.createElement("div");
    children.setAttribute("class", ".block");
    children.style.textAlign = "center";

    var landName = document.createElement("p");
    landName.innerHTML = name;
    landName.style.marginTop = "10px";
    div.onclick = (function(arg) {
      return function() {
        history.pushState({ page: 2 }, arg.name, "?land=" + arg);
        run();
      };
    })(id);
    children.innerHTML = polyImage[i]
    children.appendChild(landName);
    div.appendChild(children);
    reportList.insertBefore(div, null);
  }
}

async function run() {
  var landId = getLandIdFromURL();
  selectPage(landId);
  if (landId == 24) {

  } else {
    var lands = await getLandDetail();
    if (lands) {
      var polyImage = await getImagePolyLand(lands);
    }
    createReportListUI(lands, polyImage);
  }
}
run();
