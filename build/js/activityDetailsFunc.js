var hash = window.location.hash;
var activityId = hash.replace("#", "");
var landID;
var detailsCard = document.getElementById("card-details");
var landHeader = document.getElementById("land-header");
var landHeaderMobile = document.getElementById("land-header-mobile");
var activityDetails, toDate;
$(window, document).ready(function() {
  $("#bg-loading").css("display" , "block");
  $(".wrapper").css("display" , "none");
  findLand(activityId);
});

function findLand(activityId) {
  if (localStorage["acByName"]) {
    var activitiesArr = JSON.parse(localStorage["acByName"]);
    setActivityData(activitiesArr);
  } else {
    var body = { byLands: 1 };
    var url = "/activities/" + ownerId;
    var typ = "GET";
    var getActivities = connectToServer(url, body, typ);
    getActivities.then(docs => {
      localStorage["acByName"] = JSON.stringify(docs);
      setActivityData(docs);
    });
  }
}

function setActivityData(activitiesArr) {
  activityDetails;
  for (let i = 0; i < activitiesArr.length; i++) {
    if (activitiesArr[i].activity_id == activityId) {
      landID = activitiesArr[i].land_id;
      activityDetails = activitiesArr[i];
      break;
    }
  }
  if (activityDetails != null) {
    var getDate =
      activityDetails.end_date != null
        ? activityDetails.end_date
        : activityDetails.start_date;
    toDate = new Date(getDate);
    var date =
      toDate.getDate() +
      "/" +
      (toDate.getMonth() + 1) +
      "/" +
      toDate.getFullYear();
    landHeader.innerHTML =
      date +
      "&nbsp;&nbsp;" +
      activityDetails.land_name +
      "&nbsp;&nbsp;" +
      activityDetails.task;
    landHeaderMobile.innerHTML =
      date +
      "&nbsp;&nbsp;" +
      activityDetails.land_name +
      "&nbsp;&nbsp;" +
      activityDetails.task;
  }
  setBodyCardDetails();
}

function setBodyCardDetails() {
  var body = { activity: activityId };
  var url = "/activities/detail/" + landID;
  var typ = "GET";
  var apiDetails = connectToServer(url, body, typ);
  apiDetails.then(docs => {
    var docs = docs.activities;
    var table = document.createElement("table");
    var getNotes = docs.notes != null ? docs.notes : "-";
    var getManager = docs.manager_id != null ? docs.manager_id : "-";
    var getStatus = docs.status != null ? docs.status : "-";
    table.className = "table table-hover ";
    var task = "<tr><td>ประเภท</td><td>" + activityDetails.task + "</td></tr>";
    var landName =
      "<tr><td>ที่ดิน</td><td>" + activityDetails.land_name + "</td></tr>";
    var date = "<tr><td>วันที่</td><td>" + toDate + "</td></tr>";
    var plantName =
      "<tr><td>พืช</td><td>" + activityDetails.plant_name + "</td></tr>";
    var notes =
      "<tr><td>รายละเอียด&nbsp;&nbsp;</td><td>" + getNotes + "</td></tr>";
    var manager = "<tr><td>ผู้ดูแล</td><td>" + getManager + "</td></tr>";
    var status = "<tr><td>สถานะ</td><td>" + getStatus + "</td></tr>";
    table.innerHTML =
      task + landName + date + plantName + notes + manager + status;
    detailsCard.appendChild(table);
    $("#bg-loading").css("display" , "none");
    $(".wrapper").css("display" , "block");
  });

}
