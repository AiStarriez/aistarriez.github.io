// var managersArr = [];
// var regisManager = [];

var contentmamagerUI = document.querySelector(".content-manager-detail");
var nameHeader = document.querySelectorAll(".manager-name-header");

async function getManagerData() {
  var role = sessionStorage.role;
  var managersArr = [];
  if (role == "owner") {
    var sessionManager = sessionStorage.managers;
    if (sessionManager) {
      managersArr = JSON.parse(sessionManager);
      managersArr = managersArr.managers;
    } else {
      try {
        var url = "/managers/all/" + ownerId;
        var body = "";
        var typ = "GET";
        var getManagerAPI = await connectToServer(url, body, typ);
        managersArr = getManagerAPI.managers;
        sessionStorage.managers = JSON.stringify(getManagerAPI);
      } catch (err) {
        console.log(err);
      }
    }
  }
  return managersArr;
}

function registeredManager(managersArr) {
  var regisManager = [];
  for (i in managersArr) {
    if (managersArr[i].active) {
      regisManager.push(managersArr[i]);
    }
  }
  return regisManager;
}

function setManagerCard(regisManager) {
  var row = document.getElementById("managers-div");
  for (i in regisManager) {
    var img =
      regisManager[i].image.length != 0
        ? headerImage + regisManager[i].image
        : "build/img/farmer.png";
    var name = regisManager[i].name;
    var id = regisManager[i]._id;
    //------------------------
    var a = document.createElement("a");
    var col = document.createElement("div");
    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    cardBody.style.textAlign = "center";
    a.href = "managers.html?mg-id=" + id;
    a.setAttribute("class", "text-dark");
    col.setAttribute("class", "col-md-4");
    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body");
    cardBody.style.height = "300px";
    cardBody.innerHTML =
      '<img class="manager-img" style="border-radius: 5px" src="' +
      img +
      '"width="100%" /><br><br><span>' +
      name +
      "</span>";
    card.appendChild(cardBody);
    a.appendChild(card);
    col.appendChild(a);
    row.appendChild(col);
  }
}

async function genCodeManager() {
  var pCode = document.getElementById("manager-code");
  var loader = document.querySelector(".lds-ellipsis");
  try {
    var url = "/managers/new/" + ownerId;
    var body = "";
    var typ = "POST";
    var genCode = await connectToServer(url, body, typ);
    loader.style.display = "none";
    pCode.textContent = genCode.manager_code;
  } catch (err) {
    console.log(err);
  }
  console.log("gencode");
}

function findManager(id, regisManager) {
  for (i in regisManager) {
    if (regisManager[i]._id == id) {
      return regisManager[i];
    }
  }
}

function managerDetailUI(managerDetail) {
  var code = managerDetail._id;
  var name = managerDetail.name;
  var phone = managerDetail.contact_info.phone;
  var address = managerDetail.contact_info.address;
  var img =
    managerDetail.image != ""
      ? headerImage + managerDetail.image
      : "/build/img/farmer.png";
  for (i in nameHeader) {
    var tdName =
      '<td>&nbsp;&nbsp;<i class="fa fa-angle-right"></i>&nbsp;&nbsp;</td><td></td><h4 class="text-success">' +
      managerDetail.name +
      "</h4>";
    nameHeader[i].innerHTML = nameHeader[i].innerHTML + tdName;
  }
  contentmamagerUI.innerHTML =
    contentmamagerUI.innerHTML +
    '<div class="col-md-6"><div class="card"><div class="card-header text-success">ข้อมูลส่วนตัว</div><div class="card-body"><div style="text-align: center;"><div class="input-group mb-3"><div id="profile"></div></div></div><br><table class="table table-hover"><tr><td>รหัส</td><td>' +
    code +
    "</td></tr><tr><td>ชื่อ</td><td>" +
    name +
    "</td></tr><tr><td>เบอร์โทรศัพท์</td><td>" +
    phone +
    "</td></tr><tr><td>ที่อยู่</td><td>" +
    address +
    "</td></tr></table></div></div></div>";
  document.getElementById("profile").style.backgroundImage =
    'url("' + img + '")';
}

async function loadActivity(id) {
  var lands = localStorage["lands"];
  var landLogs = [];
  if (lands) {
    lands = JSON.parse(lands);
  } else {
    try {
      var url = "/lands/" + ownerId;
      var body = "";
      lands = await connectToServer(url, body, "GET");
    } catch (err) {
      console.log(err);
    }
  }
  for (i in lands) {
    var activities = lands[i].operation.logs.activities;
    var logObj = {
      name: lands[i].land.name,
      total: 0,
      in_progress: 0,
      done: 0,
      over_due: 0
    };
    for (j in activities) {
      var task = activities[j].status;
      if (activities[j].manager_id == id && !task.includes("ไม่")) {
        switch (task) {
          case "กำลังดำเนินการ":
            logObj.in_progress += 1;
            break;
          case "เสร็จแล้ว":
            logObj.done += 1;
            break;
          case "เลยกำหนด":
            logObj.over_due += 1;
            break;
        }
        logObj.total += 1;
      }
    }
    if (logObj.total != 0) {
      landLogs.push(logObj);
    }
  }
  return landLogs;
}

function logsManagerUI(landLogs) {
  var byLands = "";
  for (i in landLogs) {
    byLands +=
      "<p>" +
      landLogs[i].name +
      '</p><table class="table" style="text-align: center"><tr><td>' +
      landLogs[i].total +
      '</td><td class="text-warning">' +
      landLogs[i].in_progress +
      '</td><td class="text-success">' +
      landLogs[i].done +
      '</td><td class="text-danger">' +
      landLogs[i].over_due +
      '</td></tr><tr><td>ทั้งหมด</td><td class="text-warning">กำลังดำเนินการ</td><td class="text-success">เสร็จแล้ว</td><td class="text-danger">เลยกำหนด</td></tr></table>';
    if (i != 0) {
      byLands += "<hr>";
    }
  }
  var col = document.createElement("div");
  var card = document.createElement("card");
  var head = document.createElement("div");
  var body = document.createElement("div");
  col.setAttribute("class", "col-md-6");
  card.setAttribute("class", "card");
  head.setAttribute("class", "card-header text-success");
  body.setAttribute("class", "card-body");
  head.innerHTML = "พื้นที่รับผิดชอบ";
  body.innerHTML = byLands;
  card.appendChild(head);
  card.appendChild(body);
  col.appendChild(card);
  contentmamagerUI.appendChild(col);
}

function selectShowBtn() {
  var role = sessionStorage.role;
  if (role == "owner") {
    document.querySelectorAll("#new-manager-btn").forEach(el => {
      el.style.display = "unset";
    });
    document.querySelectorAll("#edit-manager-btn").forEach(el => {
      el.style.display = "none";
    });
  } else {
    document.querySelectorAll("#new-manager-btn").forEach(el => {
      el.style.display = "none";
    });
    document.querySelectorAll("#edit-manager-btn").forEach(el => {
      el.style.display = "unset";
    });
  }
}

async function run() {
  var url = window.location.toString();
  var managersArr = await getManagerData();
  var regisManager = registeredManager(managersArr);
  selectShowBtn();
  if (url.includes("?mg-id=")) {
    document.querySelectorAll("#new-manager-btn").forEach(el => {
      el.style.display = "none";
    });
    var id = url.substring(url.length - 8, url.length);
    var managerDetail = findManager(id, regisManager);
    managerDetailUI(managerDetail);
    var landLogs = await loadActivity(id);
    logsManagerUI(landLogs);
  } else {
    setManagerCard(regisManager);
  }
}

run();
