var filterByname = document.getElementById("by-name");
var filterBydate = document.getElementById("by-date");
var landNameArr = {};
var overDueUpdated = false;
localStorage.removeItem("landEmergency");
localStorage.removeItem("by-date");
localStorage.removeItem("by-name");

$("#loader").html(loadingDiv())
document.getElementById("modal-loading").style.display = "block";

async function apiGetactivities() {
  var sortBy = window.sortBy
  var url;
  if (sortBy == "by-date") {
    url = `/activities/${ownerId}?byDate=1`
  } else {
    url = `/activities/${ownerId}?byLands=1`
  }
  try {
    var typ = "GET";
    var getActivities = await connectToServer(url, "", typ);
    console.log(getActivities)
    localStorage.setItem(sortBy, JSON.stringify(getActivities))
    return getActivities
  } catch (err) {
    console.log(err)
    return false;
  }
}

function createHeaderActivitiesUI(activities) {
  var sortBy = window.sortBy;
  if (!activities) {
    $("#table-filter").css("display", "none");
    document.querySelectorAll("#new-activity-btn").forEach(el => {
      el.style.display = "none";
    });
    $("#activities-show").html("<center><h2 style='color:grey'>ยังไม่มีกิจกรรม</h2></center>")
    return false;
  }
  if (activities.length == 0) {
    $("#table-filter").css("display", "none");
    document.querySelectorAll("#new-activity-btn").forEach(el => {
      el.style.display = "none";
    });
    $("#activities-show").html("<center><h2 style='color:grey'>ยังไม่มีกิจกรรม</h2></center>")
    return false
  }
  localStorage.setItem(sortBy, JSON.stringify(activities))
}

async function updateOverDue(activities) {
  if (overDueUpdated) {
    return false
  }
  var currentDate = new Date();
  for (i in activities) {
    var acDate = new Date(activities[i].start_date);
    acDate.setDate(acDate.getDate() + 6);
    if (
      currentDate > acDate &&
      activities[i].status != "เสร็จแล้ว" &&
      activities[i].status != "เลยกำหนด"
    ) {
      try {
        var url =
          "/activities/overdue/" +
          activities[i].land_id +
          "?activity=" +
          activities[i].activity_id;
        var body = "";
        var typ = "PUT";
        var overdueUpdate = await connectToServer(url, body, typ);
      } catch (err) {
        console.log(err);
      }
    }
  }
  overDueUpdated = true;
}

function sortActivities(activitiesArr) {
  var sortBy = window.sortBy;
  var hashActivities = {};
  for (i in activitiesArr) {
    var activity = activitiesArr[i];
    if (sortBy == 'by-name') {
      if (!hashActivities[activity.land_name]) {
        landNameArr[activity.land_name] = activity.land_id
        hashActivities[activity.land_name] = [activity]
      } else {
        hashActivities[activity.land_name].push(activity);
      }
    } else {
      var getDate = activity.end_date != null ? activity.end_date : activity.start_date;
      getDate = new Date(getDate).toLocaleDateString();
      if (!hashActivities[getDate]) {
        hashActivities[getDate] = [activity]
      } else {
        hashActivities[getDate].push(activity);
      }
    }
  }
  return hashActivities
}

function setActivitiesCard(hashActivities) {
  var keys = Object.keys(hashActivities)
  var setBG, setText , setCallout;
  var bodyContent = document.getElementById("activities-show");
  bodyContent.innerHTML = "";
  for (i in keys) {
    var landHeader =
      '<div class="time-label"><span class="bg-blue">&nbsp;&nbsp;' +
      keys[i] +
      "&nbsp;&nbsp;</span></div>";
    var timeline = document.createElement("div");
    var land = hashActivities[keys[i]];
    var card = document.createElement("div");
    card.setAttribute("class", "activities-browser timeline-item");

    var mobileCard = "";
    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "timeline-body");
    var cardActivity = {};
    var subCardHeader = {}

    for (j in land) {
      var obj = land[j];

      var stDate = obj.start_date ? new Date(obj.start_date) : new Date(obj.end_date);
      var endDate = new Date(obj.end_date);
      var compareDate = new Date()
      compareDate.setDate(compareDate.getDate() + obj.repeat_in)
      compareDate.setHours(0,0,0);
      stDate = dateThai(stDate.toLocaleString(), false, true);
      endDate = dateThai(endDate.toLocaleString(), false, true);

      var activityColors = setColorActivity(obj.status);
      setBG = activityColors.setHex;
      setText = activityColors.setText;
      setCallout = activityColors.setCallout
      var keys = obj.plant_ac_id || obj.activity_id;

      if (cardActivity[keys] == null) {
        var cardAc = document.createElement("div");
        cardAc.className = "card";
        var path = obj.activity_id + "&" + obj.land_id
        subCardHeader[keys] = `<div class="callout ${setCallout}"><table class="table table-ac-header"><tr><td><a class="${setText}" href="activitydetails.html?${path}"><h4 >${obj.task}</h4></a></td>
          <td><table style="float:right;"><tr><td><button type="button" class="btn btn-block btn-info btn-sm" onclick="window.location.href='addActivity.html?land=${obj.land_id}&activity=${obj.activity_id}'"><i class="fas fa-edit"></i></button></td>
          <td><button type="button" class="btn btn-block btn-danger btn-sm" onclick="deleteActivity('${obj.land_id}' , '${obj.activity_id}')"><i class="fas fa-trash-alt"></i></button></td></tr></table></td></tr></table>`
        if(obj.repeat_in == undefined ||obj.repeat_in == 0){
          subCardHeader[keys] += `<table class="sub-header-row"><tr style="color:gray;"><td><small>วันที่</small></td><td><small>สถานะ</small></td></tr>
          <tr ><td>${stDate} - ${endDate}</td><td class="${setText}">${obj.status}</td></tr></table>`
          cardActivity[keys] = "<table>"
        }else{
          subCardHeader[keys] +=
          `<table class="sub-header-row"> <tr style=" color:gray; "><td><small> ทำซ้ำใน<small></td><td><small>ล่าสุด</small></td><td><small>สถานะ</small></td></tr>
          <tr ><td>${obj.repeat_in} วัน</td><td>${stDate} - ${endDate}</td><td class="${setText}">${obj.status}</td></tr></table>
          </small><hr><center id="show-hide-ac-${keys}" class="text-primary" onclick="subActivitiesShow('${keys}')" style="cursor:pointer; margin-bottom:10px;">
          <small>รายละเอียด <i class="fas fa-angle-up"></i></small></center>
          <div id="ac-detail-${keys}" style="display:none">`
        cardActivity[keys] = `<table class="table table-curved"><tr><td>วันที่เริ่ม</td><td>วันสิ้นสุด</td><td>กิจกรรม</td><td>สถานะ</td><td></td></tr>`
        cardActivity[keys] += setActivityFull(
          stDate,
          endDate,
          obj.task,
          obj.status,
          path,
          setBG,
          obj.activity_id,
          obj.land_id
        );

        }
      } else if (compareDate > new Date(obj.start_date)) {
        if(cardActivity[keys].includes("ครั้งถัดไป")){
          continue;
        }
        else if (new Date() < new Date(obj.end_date)) {
          cardActivity[keys] += `</table><hr><p>ครั้งถัดไป</p><table class="table table-curved"><tr><td>วันที่เริ่ม</td><td>วันสิ้นสุด</td><td>กิจกรรม</td><td>สถานะ</td><td></td></tr>`
        } else {
          subCardHeader[keys] = `<div class="callout ${setCallout}"><table class="table table-ac-header"><tr><td><a class="${setText}" href="activitydetails.html?${path}"><h4 >${obj.task}</h4></a></td>
          <td><table style="float:right;"><tr><td><button type="button" class="btn btn-block btn-info btn-sm" onclick="window.location.href='addActivity.html?land=${obj.land_id}&activity=${obj.activity_id}'"><i class="fas fa-edit"></i></button></td>
          <td><button type="button" class="btn btn-block btn-danger btn-sm" onclick="deleteActivity('${obj.land_id}' , '${obj.activity_id}')"><i class="fas fa-trash-alt"></i></button></td></tr></table></td></tr></table>
          <table class="sub-header-row"> <tr style=" color:gray; "><td><small> ทำซ้ำใน<small></td><td><small>ล่าสุด</small></td><td><small>สถานะ</small></td></tr>
          <tr ><td>${obj.repeat_in} วัน</td><td>${stDate} - ${endDate}</td><td class="${setText}">${obj.status}</td></tr></table>
          </small><hr><center id="show-hide-ac-${keys}" class="text-primary" onclick="subActivitiesShow('${keys}')" style="cursor:pointer; margin-bottom:10px;">
          <small>รายละเอียด <i class="fas fa-angle-up"></i></small></center>
          <div id="ac-detail-${keys}" style="display:none">`
        }
        cardActivity[keys] += setActivityFull(
          stDate,
          endDate,
          obj.task,
          obj.status,
          obj.activity_id + "&" + obj.land_id,
          setBG,
          obj.activity_id,
          obj.land_id
        );

      }
    }
    var activitiesLandKeys = Object.keys(cardActivity)
    activitiesLandKeys.forEach((landKeys , index)=> {
      cardActivity[landKeys] += "</table></div></div>"
      cardActivity[landKeys] = subCardHeader[landKeys] + cardActivity[landKeys]
      if(index == 1 && activitiesLandKeys.length > 2){
        cardBody.innerHTML += cardActivity[landKeys]
        cardBody.innerHTML += `<center class="text-primary all-details-${i}" onclick="activitiesAllShow('${i}')" style="margin:10px;cursor:pointer">ดูทั้งหมด</center>`
      }else if(index > 1){
        cardBody.innerHTML += `<div class="all-details-${i}" style="display:none">${cardActivity[landKeys]}</div>`
      }else{
        cardBody.innerHTML += cardActivity[landKeys]
      }
    })
    cardBody.innerHTML += `<center class="text-primary all-details-${i}" onclick="activitiesAllShow('${i}')" style="margin:10px; display:none; cursor:pointer">ซ่อน</center>`
    card.appendChild(cardBody);
    bodyContent.innerHTML = bodyContent.innerHTML + landHeader;
    timeline.appendChild(card);
    bodyContent.appendChild(timeline);
    bodyContent.innerHTML = bodyContent.innerHTML + mobileCard;
  }

}

function subActivitiesShow(landKeys) {
  $(`#ac-detail-${landKeys}`).toggle(500)
  if ($(`#show-hide-ac-${landKeys}`).html() == '<small>รายละเอียด <i class="fas fa-angle-down"></i></small>') {
    $(`#show-hide-ac-${landKeys}`).html('<small>รายละเอียด <i class="fas fa-angle-up"></i></small>')
  } else {
    $(`#show-hide-ac-${landKeys}`).html('<small>รายละเอียด <i class="fas fa-angle-down"></i></small>')
  }
}

function activitiesAllShow(landId){
  $(`.all-details-${landId}`).map(function() {
    $(this).toggle(500)
  }).get();
}

function getLandName() {
  var landNameDropdown = document.getElementById("land-dropdown");
  var landNameFilter = document.getElementById("land-name-filter");
  var landNameHash = Object.keys(landNameArr)
  for (i in landNameHash) {
    var fName = document.createElement("a");
    fName.innerHTML = landNameHash[i];
    fName.setAttribute("class", "dropdown-item");
    fName.setAttribute("role", "presentation");
    landNameDropdown.appendChild(fName);
    fName.onclick = (function (arg) {
      return function () {
        $("#modal-error-text").css("display", "none");
        landNameFilter.innerHTML = arg;
        localStorage.landEmergency = landNameArr[arg];
      };
    })(landNameHash[i]);
  }
}

var $div = $("#modal-add-activity");
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.attributeName === "class") {
      var attributeValue = $(mutation.target).prop(mutation.attributeName);
      if (!attributeValue.includes("show")) {
        localStorage.removeItem("landEmergency");
      }
    }
  });
});

observer.observe($div[0], {
  attributes: true
});

function initBtn() {
  // ! filterByname.addEventListener("click", () => {
  //   window.sortBy = "by-name";
  //   selPageUI()
  // });
  // filterBydate.addEventListener("click", () => {
  //   window.sortBy = "by-date";
  //   selPageUI()
  // })
  $("#emer-ac-btn").click(function () {
    console.log("emer click");
    var landId = localStorage.landEmergency;
    if (landId) {
      window.location = "addActivity.html?land=" + landId;
    } else {
      $("#modal-error-text").css("display", "block");
    }
  });
}

async function selPageUI() {
  var sortBy = window.sortBy
  var activities = localStorage.getItem(sortBy)
  if (activities) {
    activities = JSON.parse(activities)
  } else {
    activities = await apiGetactivities();
  }
  if (activities.length == 0) {
    $("#no-activty").show()
  } else {
    $("#no-activty").hide()

  }
  createHeaderActivitiesUI(activities);
  var hashActivities = sortActivities(activities);
  setActivitiesCard(hashActivities);
  updateOverDue(activities);

}

async function run() {
  window.sortBy = "by-name";
  console.log("SEL")
  await selPageUI();
  initBtn();
  getLandName();
  $("#loader").html(loadingDiv())
  document.getElementById("modal-loading").style.display = "none";
}
run();