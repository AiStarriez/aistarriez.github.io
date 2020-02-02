var hash = window.location.hash;
hash = hash.replace("#", "");
var query = hash.split("&");
var landID;
var detailsCard = document.getElementById("card-details");
var imageCard = document.getElementById("card-image");
var landHeader = document.getElementById("land-header");
var landHeaderMobile = document.getElementById("land-header-mobile");
var modalBigImg = document.getElementById("modalImage");
var modalImg = document.getElementById("img01");
var thisActivity;
var activityDetails, toDate;

$("#modalImage").click(function() {
  modalBigImg.style.display = "none";
});

function toUpdateProgress() {
  window.location =
    "addActivity.html?land=" + query[1] + "&activity=" + query[0];
}

async function findLand(query) {
  if (localStorage["acByName"]) {
    var activitiesArr = JSON.parse(localStorage["acByName"]);
    return activitiesArr;
  } else {
    try {
      var body = { byLands: 1 };
      var url = "/activities/" + ownerId;
      var typ = "GET";
      var getActivities = await connectToServer(url, body, typ);
      return getActivities;
    } catch (err) {
      console.log(err);
    }
  }
}

function setActivityData(activitiesArr) {
  activityDetails;
  for (let i = 0; i < activitiesArr.length; i++) {
    if (
      activitiesArr[i].activity_id == query[0] &&
      activitiesArr[i].land_id == query[1]
    ) {
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
      (toDate.getFullYear() + 543);
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
  return activityDetails;
}

function setBodyCardDetails(activityData) {
  var table = document.createElement("table");
  var getNotes = activityData.notes != null ? activityData.notes : "-";
  var getManager = activityData.manager_id != null ? activityData.manager_id : "-";
  var getStatus = activityData.status != null ? activityData.status : "-";
  table.className = "table table-hover ";
  var task = "<tr><td>ประเภท</td><td>" + activityDetails.task + "</td></tr>";
  var landName =
    "<tr><td>ที่ดิน</td><td>" + activityDetails.land_name + "</td></tr>";
  var date =
    "<tr><td>วันที่</td><td>" +
    dateThai(toDate.toLocaleString()) +
    "</td></tr>";
  var plantName =
    "<tr><td>พืช</td><td>" + activityDetails.plant_name + "</td></tr>";
  var notes =
    "<tr><td>รายละเอียด&nbsp;&nbsp;</td><td>" + getNotes + "</td></tr>";
  var manager = "<tr><td>ผู้ดูแล</td><td>" + getManager + "</td></tr>";
  var status = "<tr><td>สถานะ</td><td>" + getStatus + "</td></tr>";
  table.innerHTML =
    task + landName + date + plantName + notes + manager + status;
  detailsCard.appendChild(table);
  $("#modal-loading").css("display", "none");
  $(".wrapper").css("display", "block");
}

async function getDetailAPI(apiDetails) {
  try {
    var body = { activity: query[0] };
    var url = "/activities/detail/" + landID;
    var typ = "GET";
    var apiDetails = await connectToServer(url, body, typ);
    return apiDetails;
  } catch (err) {
    console.log(err);
  }
}

function setBodyCardImages(activityData) {
  var imagesArr = activityData.images;
  for (i in imagesArr) {
    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.marginRight = "14px";
    div.style.marginBottom = "14px";
    var children = document.createElement("div");
    children.setAttribute("class", ".block");
    // canvas to img
    var imageShow = document.createElement("img");
    imageShow.setAttribute("class", "myImg");
    imageShow.setAttribute("src", headerImage + imagesArr[i]);
    imageShow.onclick = function() {
      modalBigImg.style.display = "block";
      modalImg.src = this.src;
    };
    children.appendChild(imageShow);
    div.appendChild(children);
    imageCard.appendChild(div);
  }
}

async function run() {
  $("#modal-loading").css("display", "block");
  $(".wrapper").css("display", "none");
  var activitiesArr = await findLand(query);
  var activityData = setActivityData(activitiesArr);
  setBodyCardDetails(activityData);
  setBodyCardImages(activityData);
  sessionStorage.updateActivity = JSON.stringify(activityData);
  sessionStorage.landHeader = landHeader.innerHTML;
}

run()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch(err => {
    console.log("ERROR", err);
  });
