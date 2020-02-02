// var managersArr = [];
// var regisManager = [];

var contentmamagerUI = document.querySelector(".content-manager-detail");
var nameHeader = document.querySelectorAll(".manager-name-header");
var rowManagerList = document.getElementById("managers-div");
var id = managerId();
var managerData,managerImage;


async function getManagerData(newerData) {
  var role = sessionStorage.role;
  var managersArr = [];
  if (newerData) {
    sessionStorage.removeItem("managers");
  }
  if (role == "owner") {
    var sessionManager = sessionStorage.managers;
    if (sessionManager) {
      managersArr = JSON.parse(sessionManager);
      managersArr = managersArr.managers;
      return managersArr;
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
  history.pushState({ page: 1 }, "main", "");
  for (i in regisManager) {
    var img =
      regisManager[i].image.length != 0
        ? headerImage + regisManager[i].image
        : "build/img/farmer.png";
    var name = regisManager[i].name;
    var id = regisManager[i]._id;
    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.marginRight = "14px";
    div.style.marginBottom = "14px";
    div.style.cursor = "pointer";
    var children = document.createElement("div");
    children.setAttribute("class", ".block");
    children.style.textAlign = "center";
    var imageShow = document.createElement("img");
    imageShow.style.boxShadow =
      "0 0 2px rgba(0,0,0,.125),0 2px 3px rgba(0,0,0,.2)";
    imageShow.setAttribute("class", "myImg");
    imageShow.setAttribute("src", img);

    var managerName = document.createElement("p");
    managerName.innerHTML = name;
    managerName.style.marginTop = "10px";
    div.onclick = (function(arg) {
      return function() {
        history.pushState({ page: 2 }, arg.name, "?mg-id=" + arg);
        run();
      };
    })(id);
    children.appendChild(imageShow);
    children.appendChild(managerName);
    div.appendChild(children);
    rowManagerList.insertBefore(div, null);
  }
}

window.onpopstate = function() {
  run();
};

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

async function initButton() {
  document.querySelectorAll("#new-manager-btn").forEach(el => {
    el.onclick = () => {
      $("#modal-created-code").css("display", "block");
      $("#modal-del-manager").css("display", "none");
      genCodeManager();
    };
  });
  document.querySelectorAll("#del-manager-btn").forEach(el => {
    el.onclick = () => {
      $("#modal-created-code").css("display", "none");
      $("#modal-del-manager").css("display", "block");
    };
  });
  document.getElementById("del-manager-conf").onclick = async () => {
    $("#modal-del-manager").css("display", "none");
    $("#moda-response").html(
      ' <div id="modal-loading" style="width: 100%; text-align:center; display: none;"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>'
    );

    var delManaer = await deleteManager(id);
    if (delManaer) {
      await getManagerData(true);
      window.history.back();
      run();
      $("#modal-manager").modal("toggle");
      $("#moda-response").css("display", "none");
    }
  };
  document.querySelectorAll("#edit-manager-btn").forEach(el => {
    el.onclick = () => {
      history.pushState({ page: 2 }, 1, "?edit=" + managerData._id);
      editManagerDetail(managerData);
    };
  });
  $("#save-edit-btn").click(async () => {
    if(managerImage){
      fileUpload(query)
    }
  })
}

async function deleteManager(id) {
  try {
    var url = `/managers/quit/${id}?owner=${sessionStorage.ownerId}`;
    var deleteManager = await connectToServer(url, "", "DELETE");
    console.log("delete manager success");
  } catch (err) {
    console.log(err.status, err.responseText);
    if (err.status != 200) {
      $("#moda-response").html(
        "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง" +
          '<div style="width: 100%; text-align:right;"><button id="close-gencode-modal-btn" class="btn bg-olive" data-dismiss="modal">&nbsp;ปิด&nbsp;</button></div>'
      );
      return false;
    } else {
      return true;
    }
  }
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

function selectShowBtn(id) {
  var role = sessionStorage.role;
  if (role == "owner") {
    if (id.length == 8) {
      document.querySelectorAll("#edit-manager-btn").forEach(el => {
        el.style.display = "none";
      });
      document.querySelectorAll("#del-manager-btn").forEach(el => {
        el.style.display = "block";
      });
      document.querySelectorAll("#new-manager-btn").forEach(el => {
        el.style.display = "none";
      });
    } else {
      document.querySelectorAll("#edit-manager-btn").forEach(el => {
        el.style.display = "none";
      });
      document.querySelectorAll("#new-manager-btn").forEach(el => {
        el.style.display = "block";
      });
      document.querySelectorAll("#del-manager-btn").forEach(el => {
        el.style.display = "none";
      });
    }
  } else {
    document.querySelectorAll("#new-manager-btn").forEach(el => {
      el.style.display = "none";
    });
    document.querySelectorAll("#del-manager-btn").forEach(el => {
      el.style.display = "none";
    });
    document.querySelectorAll("#edit-manager-btn").forEach(el => {
      el.style.display = "block";
    });
  }
}
window.onpopstate = function() {
  run();
};

function managerId() {
  var url = window.location.toString();
  var idIndex = url.indexOf("mg-id=") + 6;
  var managerId = url.slice(idIndex, url.length);
  return managerId;
}

function editManagerDetail(managerData) {
  // $("#manager-register-ui").css("display", "block");
  $(".content-manager-detail").hide(500);
  $("#manager-register-ui").show(500);

  document.querySelectorAll("#edit-manager-btn").forEach(el => {
   el.style.display ="none";
  });
  document.getElementById("name-manager-input").value = managerData.name
  document.getElementById("phone-manager-input").value = managerData.contact_info.phone
  document.getElementById("addres-manager-input").value = managerData.contact_info.address
}

async function run() {
  
  id = managerId();
  rowManagerList.innerHTML = "";
  contentmamagerUI.innerHTML = "";
  var managersArr = await getManagerData(false);
  var regisManager = managersArr.filter(({ active }) => active == true);
  selectShowBtn(id);
  if (sessionStorage.role == "manager") {
    var userData = JSON.parse(sessionStorage.user);
    managerData = userData[0].manager
    var landLogs = await loadActivity(managerData._id);
    $("#header-managers-list").css("display", "none");
    $("#header-manager-detail").css("display", "none");
    $("#manager-register-ui").hide(500);
    $(".content-manager-detail").show(500);
    $("#dd-header").css("display", "none");
    $("#extend-header").html("ข้อมูลส่วนตัว");

    if(id.includes("?edit=")){
      editManagerDetail(managerData);
      return true
    }
    console.log(id)
    managerDetailUI(managerData);
    logsManagerUI(landLogs);
    return true;
  }
  if (id.length == 8) {
    var managerDetail = regisManager.find(({ _id }) => _id === id);
    var landLogs = await loadActivity(id);
    $("#header-managers-list").css("display", "none");
    $("#header-manager-detail").css("display", "block");
    $("#dd-header").css("display", "block");
    $("#extend-header").html(`&nbsp;&nbsp;${managerDetail.name}`);
    managerDetailUI(managerDetail);
    logsManagerUI(landLogs);
  } else {
    $("#header-managers-list").css("display", "block");
    $("#header-manager-detail").css("display", "none");
    $("#dd-header").css("display", "none");
    $("#extend-header").html("");
    setManagerCard(regisManager);
  }
}

run();
initButton();
