async function initBtn() {
  document.querySelectorAll("#export-csv-btn").forEach(el => {
    el.onclick = async () => {
      console.log("onclick")
      var csvData = [
        ['ที่ดิน', 'วันที่เริ่ม', 'วันสิ้นสุด', 'พืชที่ปลูก', '', 'ผลผลิตที่คาดหวัง', 'ผลผลิตจริง', 'ประสิทธิภาพ'],

      ]
      var landId = getLandIdFromURL();
      var cycleId = getopCycleIdFromURL();
      var reportPerLand = await getReportPerLand(landId);
      var lands = await getLandDetail();
      var managers = await getManagersDetails();
      managers = managers.managers
      var logs = reportPerLand.logs;
      var cycle = logs.find(({
        _id
      }) => _id === cycleId);

      var land = lands.find(({
        land
      }) => land._id === landId);
      startDate = dateThai(new Date(cycle.start_date).toLocaleString(), false, true)
      endDate = dateThai(new Date(cycle.end_date).toLocaleString(), false, true)
      var headerCsv = [land.land.name, startDate, endDate, cycle.plant_name, '', cycle.expected_product, cycle.real_product, cycle.performance]
      csvData.push(headerCsv);
      csvData.push(['']);
      csvData.push(['บันทึกกิจกรรม'])
      csvData.push(['วันที่', 'กิจกรรม', 'ผู้ดูแล', 'สถานะ'])
      cycle.activities.forEach(activity => {
        var date = activity.end_date != null ? activity.end_date : activity.start_date;
        var manager = managers.find(({
          _id
        }) => _id == activity.manager_id);
        var managerName = manager ? manager.name : "-"
        date = dateThai(new Date(date).toLocaleString(), false, true)
        date = activity.status == 'ยังไม่ทำ' ? '-' : date
        var acDetails = [date, activity.task, managerName, activity.status];
        csvData.push(acDetails);
      })
      exportToCsv(`${land.land.name}-${startDate}-${endDate}.csv`, csvData)
    }
  })
}

function selectPage(landId, cycleId) {
  $("#dd-menu").hide()

  if (landId.length == 24) {
    $("#container-report-list").hide(500);
    $("#header-report-list").hide();
    $("#container-report-perland").show(500);
    $("#header-report-detail").show();
    $("#container-report-cycle").hide(500);
    $("#back-report").hide()
    $("#hamburger").show()
    $("#back-report").show()
    $("#hamburger").hide()
    document.querySelectorAll("#export-csv-btn").forEach(el => {
      el.style.display = "none";
    });
    if (cycleId.length == 24) {
      $("#dd-menu").show()
      $("#container-report-perland").hide(500);
      $("#container-report-cycle").show(500);
      document.querySelectorAll("#export-csv-btn").forEach(el => {
        el.style.display = "block";
      });
    }
  } else {
    $("#container-report-perland").hide(500);
    $("#header-report-detail").hide();
    $("#container-report-list").show(500);
    $("#header-report-list").show();
    $("#container-report-cycle").hide(500);
    $("#back-report").hide()
    $("#hamburger").show()
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
async function getManagersDetails() {
  var managers = localStorage.managers;
  if (managers) {
    managers = JSON.parse(managers);
  } else {
    try {
      url = `/managers/all/${ownerId}`;
      var managersData = await connectToServer(url, "", "GET");
      managers = managersData;
      localStorage.managers = JSON.stringify(managers);
    } catch (err) {
      console.log(err);
    }
  }
  if (managers.length == 0 || !managers) {
    return false;
  }
  return managers;
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
    var cardSize = screen.width < 780 ? '80%' : '25vw'
    var img = `<img class="myImg" style="width:${cardSize};height:${cardSize};" src="https://maps.googleapis.com/maps/api/staticmap?center=${polygon.center.lat}, ${polygon.center.lng}&zoom=18&path=color:0xff0000ff%7Cweight:0%7Cfillcolor:0x0000ff80`;
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
  var landIndex = url.indexOf("land=");
  if (landIndex == -1) {
    return false;
  }
  var landId = url.substring(landIndex + 5, landIndex + 29);
  return landId;
}

function getopCycleIdFromURL() {
  var url = window.location.toString();
  var cycle = url.indexOf("cycle=");
  if (cycle == -1) {
    return false
  }
  var cycleId = url.substring(cycle + 6, cycle + 30);
  return cycleId;
}
async function getReportPerLand(landId) {
  if (landId.length != 24) {
    return false;
  }
  try {
    var url = `/reports/${landId}`
    var reportPerLand = await connectToServer(url, "", "GET");
    return reportPerLand
  } catch (err) {
    console.log(err)
    if (err.status == 200) {
      return reportPerLand
    }
  }

}

function createReportListUI(lands, polyImage) {
  history.pushState({
    page: 1
  }, "main", "");
  var reportList = document.getElementById("container-report-list");
  reportList.innerHTML = ""
  var extendHeader = document.querySelectorAll("#extend-header");
  extendHeader[0].innerHTML = "รายงานที่ดิน";
  extendHeader[1].innerHTML = ""
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
    div.onclick = (function (arg) {
      return function () {
        history.pushState({
          page: 2
        }, arg.name, "?land=" + arg);
        run();
      };
    })(id);
    children.innerHTML = polyImage[i]
    children.appendChild(landName);
    div.appendChild(children);
    reportList.insertBefore(div, null);
  }
}

async function createReportPerlandListUI(landId, landName) {
  var container = document.getElementById("container-report-perland");
  container.innerHTML = ""
  document.querySelectorAll("#extend-header").forEach(el => {
    el.innerHTML = landName
  })
  var reportPerLand = await getReportPerLand(landId);
  var logs = reportPerLand.logs;
  if(logs.length == 0){
      container.innerHTML =  `<center style="color:grey"><h2>ยังไม่มีรายงานสำหรับที่ดิน '${landName}'</h2></center>`;
      return false;
  }
  var table = document.createElement("table");
  var tableHeader = document.createElement("tr");
  tableHeader.innerHTML = '<td>พืช</td><td>วันที่เริ่ม</td><td>วันสิ้นสุด</td>';
  table.style.textAlign = "center"
  table.innerHTML = '<tr><th>พืช</th><th>วันที่เริ่ม</th><th>วันสิ้นสุด</th></tr>'
  table.className = "table table-curved"
  container.appendChild(table);
  logs.forEach(cycle => {
    var row = document.createElement("tr");
    var plant = cycle.plant_name;
    var start_date = dateThai(new Date(cycle.start_date).toLocaleString(), false, true)
    var end_date = dateThai(new Date(cycle.end_date).toLocaleString(), false, true)
    row.innerHTML = `<td>${plant}</td><td>${start_date}</td><td>${end_date}</td>`
    row.onclick = (function (arg) {
      return function () {
        history.pushState({
          page: 2
        }, arg.name, `?land=${landId}&cycle=${arg}`);
        run();
      };
    })(cycle._id);
    table.appendChild(row);
  });
}

async function createReportCycleUI(landId, cycleId) {
  var container = document.getElementById("container-report-cycle")
  container.innerHTML = "";
  var haederText = document.querySelectorAll("#extend-header")
  var reportPerLand = await getReportPerLand(landId);
  var managers = await getManagersDetails();
  managers = managers.managers
  var lands = await getLandDetail();
  var land = lands.find(({
    land
  }) => land._id === landId);
  var logs = reportPerLand.logs;
  var cycle = logs.find(({
    _id
  }) => _id === cycleId);
  startDate = dateThai(new Date(cycle.start_date).toLocaleString(), false, true)
  endDate = dateThai(new Date(cycle.end_date).toLocaleString(), false, true)
  haederText[0].innerHTML = ""
  haederText[1].innerHTML = (land.land.name + "&nbsp;&nbsp;" + startDate + "&nbsp;&nbsp; - &nbsp;&nbsp;" + endDate)
  cycle.performance = parseInt(cycle.performance)
  var performanceBig = cycle.performance >= 100 ? `<h4 class="text-success">${cycle.performance} %</h4>` : `<h4 class="text-danger">${cycle.performance} %</h4>`
  var performanceSm = cycle.performance >= 100 ? `<td class="text-success" style="padding-right:0px">${cycle.performance} %</td>` : `<td class="text-danger" style="padding-right:0px">${cycle.performance} %</td>`
  // --------------big screen total table--------------------- //
  var divTableBig = document.createElement("div");
  var tableTotal = document.createElement('table');
  divTableBig.className = "card-body table-responsive p-0 total-big"
  tableTotal.className = "table text-nowrap"
  tableTotal.style.textAlign = "center"
  tableTotal.innerHTML = `<tr style="color:grey"><td>พืช</td></td><td>ผลผลิตที่คาดหวัง</td><td>ผลผลิตจริง</td><td>ประสิทธิภาพ</td></tr>`
  tableTotal.innerHTML += `<tr><td><h4 class="text-primary">${cycle.plant_name}</h4></td><td><h4>${cycle.expected_product}</h4></td><td><h4>${cycle.real_product}</h4></td><td>${performanceBig}</td></tr>`

  divTableBig.appendChild(tableTotal)
  container.appendChild(divTableBig)
  // ---------------small screen total table--------------------- //
  var divTableSmall = document.createElement("div");
  var tableTotalSmall = document.createElement('table');
  divTableSmall.className = "card-body table-responsive p-0 total-small"
  tableTotalSmall.className = "table text-nowrap"
  tableTotalSmall.style.textAlign = "center"
  tableTotalSmall.innerHTML = `<tr style="font-size:1rem; color:grey"><td style="padding-left:0px">พืช</td><td>ผลผลิตที่คาดหวัง</td><td>ผลผลิตจริง</td><td style="padding-right:0px">ประสิทธิภาพ</td></tr>`
  tableTotalSmall.innerHTML += `<tr><td class="text-primary" style="padding-left:0px">${cycle.plant_name}</td><td>${cycle.expected_product}</td><td>${cycle.real_product}</td>${performanceSm}</tr>`
  divTableSmall.appendChild(tableTotalSmall)
  container.appendChild(divTableSmall)
  container.innerHTML += '<hr><p>รายละเอียดกิจกรรม</p>'
  // -----------------big screen activities------------------- //
  var bdivActivitiesTable = document.createElement('div');
  var btableActivities = document.createElement("table");
  bdivActivitiesTable.className = "activities-big"
  btableActivities.className = "table table-curved"

  var sdivActivitiesTable = document.createElement('div');
  sdivActivitiesTable.className = "activities-small"
  cycle.activities.forEach(activity => {
    var date = activity.end_date != null ? activity.end_date : activity.start_date;
    var manager = managers.find(({
      _id
    }) => _id == activity.manager_id);
    var managerName = manager ? manager.name : '-'
    var activityColors = setColorActivity(activity.status);
    date = dateThai(new Date(date).toLocaleString(), false, true)
    date = activity.status == 'ยังไม่ทำ' ? '-' : date;
    btableActivities.innerHTML += `<tr"><td style="background-color:${activityColors.setHex}">${date}</td><td style="background-color:${activityColors.setHex}">${activity.task}</td><td style="background-color:${activityColors.setHex}">${managerName}</td><td style="background-color:${activityColors.setHex}">${activity.status}</td></tr">`
    // -------------- small screen activities ---------------- //
    var card = document.createElement('div')
    var cardBody = document.createElement('div')
    var table = document.createElement("table");
    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body " + activityColors.setText);
    table.className = "table"
    table.innerHTML = `<tr><td>${activity.task}</td><td class="text-gray" style="text-align: right"><small>${managerName}</small></td></tr>`
    var statusText = `<small><i class="fas fa-calendar-week"></i>&nbsp;&nbsp${date}</small>&nbsp;&nbsp;<small><i class="fas fa-walking"></i>&nbsp;&nbsp;${activity.status}</small>`
    cardBody.appendChild(table);
    cardBody.innerHTML += statusText
    card.appendChild(cardBody);
    sdivActivitiesTable.appendChild(card);

  })
  bdivActivitiesTable.appendChild(btableActivities)
  container.appendChild(bdivActivitiesTable)
  container.appendChild(sdivActivitiesTable)
}

function exportToCsv(fName, rows) {
  var csv = '';
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    for (var j = 0; j < row.length; j++) {
      var val = row[j] === null ? '' : row[j].toString();
      val = val.replace(/\t/gi, " ");
      if (j > 0)
        csv += '\t';
      csv += val;
    }
    csv += '\n';
  }

  // for UTF-16
  var cCode, bArr = [];
  bArr.push(255, 254);
  for (var i = 0; i < csv.length; ++i) {
    cCode = csv.charCodeAt(i);
    bArr.push(cCode & 0xff);
    bArr.push(cCode / 256 >>> 0);
  }

  var blob = new Blob([new Uint8Array(bArr)], {
    type: 'text/csv;charset=UTF-16LE;'
  });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, fName);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = window.URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }
}


window.onpopstate = function () {
  run();
};

async function run() {
  var landId = getLandIdFromURL();
  var cycleId = getopCycleIdFromURL()
  var lands = await getLandDetail();
  selectPage(landId, cycleId);
  if (cycleId) {
    createReportCycleUI(landId, cycleId)
  } else if (landId.length == 24) {
    var land = lands.find(({
      land
    }) => land._id === landId);
    var landName = land.land.name
    createReportPerlandListUI(landId, landName)
  } else {
    if (lands) {
      var polyImage = await getImagePolyLand(lands);
    }
    createReportListUI(lands, polyImage);
  }
}
run();
initBtn();