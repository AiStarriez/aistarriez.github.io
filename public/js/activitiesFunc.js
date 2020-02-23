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
  var setBG, setText;
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
    var responsiveTable = document.createElement("div");
    responsiveTable.className = "card-body table-responsive p-0";
    var table = document.createElement("table");
    table.className += "activities-browser table table-curved";

    for (j in land) {
      var obj = land[j];

      var fullDate = obj.end_date != null ? obj.end_date : obj.start_date;
      var date = new Date(fullDate);
      date = dateThai(date.toLocaleString(), false, true);
      var rowActivity = "";
      var activityColors = setColorActivity(obj.status);
      setBG = activityColors.setHex;
      setText = activityColors.setText;

      if (localStorage["role"] == '"owner"') {
        rowActivity += setActivityOwnerUI(
          obj.land_name,
          date,
          obj.task,
          obj.status,
          obj.activity_id + "&" + obj.land_id,
          setBG,
          obj.activity_id,
          obj.land_id

        );
        mobileCard =
          mobileCard +
          setactivityOwnerMobile(
            sortBy,
            obj.land_name,
            date,
            obj.task,
            obj.status,
            obj.activity_id + "&" + obj.land_id,
            setText,
            obj.activity_id,
            obj.land_id
          );
      } else {
        rowActivity += setActivityManagerUI(
          obj.land_name,
          date,
          obj.task,
          obj.status,
          obj.activity_id + "&" + obj.land_id,
          setBG,
          obj.activity_id,
          obj.land_id
        );
        mobileCard =
          mobileCard +
          setactivityManagerMobile(
            sortBy,
            obj.land_name,
            date,
            obj.task,
            obj.status,
            obj.activity_id + "&" + obj.land_id,
            setText,
            obj.activity_id,
            obj.land_id
          );
      }
      table.innerHTML = table.innerHTML + rowActivity;
    }
    responsiveTable.appendChild(table);
    cardBody.appendChild(responsiveTable);
    card.appendChild(cardBody);
    bodyContent.innerHTML = bodyContent.innerHTML + landHeader;
    timeline.appendChild(card);
    bodyContent.appendChild(timeline);
    bodyContent.innerHTML = bodyContent.innerHTML + mobileCard;
  }

}

function getLandName() {
  console.log("landNameArr", landNameArr)
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
  filterByname.addEventListener("click", () => {
    window.sortBy = "by-name";
    selPageUI()
  });
  filterBydate.addEventListener("click", () => {
    window.sortBy = "by-date";
    selPageUI()
  })
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