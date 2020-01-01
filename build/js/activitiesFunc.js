$(window, document).ready(function() {
  window.sortBy = "by-name";
  apiGetactivities(window.sortBy);
});

var filterByname = document.getElementById("by-name");
var filterBydate = document.getElementById("by-date");

var activities;

filterBydate.addEventListener("click", function(e) {
  window.sortBy = e.target.id;
  apiGetactivities(window.sortBy);
});
filterByname.addEventListener("click", function(e) {
  window.sortBy = e.target.id;
  apiGetactivities(window.sortBy);
});

function apiGetactivities(sortBy) {
  activities = null;
  var body;
  if (sortBy == "by-date") {
    if (localStorage["acByDate"]) {
      activities = JSON.parse(localStorage["acByDate"]);
    } else {
      var body = { byDate: 1 };
    }
  } else {
    if (localStorage["acByName"]) {
      activities = JSON.parse(localStorage["acByName"]);
    } else {
      var body = { byLands: 1 };
    }
  }
  if (activities == null) {
    var url = "/activities/" + ownerId;
    var typ = "GET";
    var getActivities = connectToServer(url, body, typ);
    getActivities.then(docs => {
      if (sortBy == "by-date") {
        localStorage["acByDate"] = JSON.stringify(docs);
      } else {
        localStorage["acByName"] = JSON.stringify(docs);
      }
      activities = docs;
      setActivityUI(activities, sortBy);
      console.log(docs);
    });
  } else {
    setActivityUI(activities, sortBy);
  }
}

function setActivityUI(docs, sortBy) {
  var bodyContent = document.getElementById("activities-show");
  bodyContent.innerHTML = "";
  var setBG , setText;
  var classColor = {
    done: "bg-success",
    over_due: "bg-danger",
    not_done: "bg-secondary",
    in_progress: "bg-warning"
  };
  var classText = {
    done: "text-success",
    over_due: "text-danger",
    not_done: "text-secondary",
    in_progress: "text-warning"
  };
  var keyLands = [];
  var newObj;

  if (sortBy == "by-name") {
    var count = 0;
    var landName = docs[0].land_name;
    var activityArr = [];
    var acByName = [];

    activityArr.push(docs[0]);
    count++;
    while (count != docs.length) {
      if (landName == docs[count].land_name) {
        activityArr.push(docs[count]);
      } else {
        var obj = {};
        obj[docs[count - 1].land_name] = activityArr;
        acByName.push(obj);
        keyLands.push(docs[count - 1].land_name);
        activityArr = [];
        activityArr.push(docs[count]);
      }
      if (count == docs.length - 1) {
        var obj = {};
        obj[docs[count - 1].land_name] = activityArr;
        acByName.push(obj);
        keyLands.push(docs[count - 1].land_name);
      }
      landName = docs[count].land_name;
      count++;
    }
    newObj = JSON.parse(JSON.stringify(acByName));
  } else {
    var count = 0;
    var getDate =
      docs[0].end_date != null ? docs[0].end_date : docs[0].start_date;
    var toDate = new Date(getDate);
    var date =
      toDate.getDate() +
      "/" +
      (toDate.getMonth() + 1) +
      "/" +
      toDate.getFullYear();
    var activityArr = [];
    var acByDate = [];
    var keyDate = date;
    activityArr.push(docs[0]);
    count++;
    while (count != docs.length) {
      var getDate =
        docs[count].end_date != null
          ? docs[count].end_date
          : docs[count].start_date;
      var toDate = new Date(getDate);
      var compareDate =
        toDate.getDate() +
        "/" +
        (toDate.getMonth() + 1) +
        "/" +
        toDate.getFullYear();

      if (date == compareDate) {
        activityArr.push(docs[count]);
      } else {
        var obj = {};
        obj[keyDate] = activityArr;
        acByDate.push(obj);
        keyLands.push(keyDate);
        activityArr = [];
        activityArr.push(docs[count]);
        keyDate = compareDate;
      }
      if (count == docs.length - 1) {
        var obj = {};
        obj[keyDate] = activityArr;
        acByDate.push(obj);
        keyLands.push(keyDate);
      }
      date = compareDate;
      count++;
    }
    newObj = JSON.parse(JSON.stringify(acByDate));
  }
  for (let i = 0; i < newObj.length; i++) {
    var landHeader =
      '<div class="time-label"><span class="bg-blue">' +
      keyLands[i] +
      "</span></div>";
    var timeline = document.createElement("div");
    var land = newObj[i];
    var card = document.createElement("div");
    card.setAttribute("class", "activities-browser timeline-item");

    var mobileCard = "";
    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "timeline-body");
    var responsiveTable = document.createElement("div");
    responsiveTable.className = "card-body table-responsive p-0";

    for (let j = 0; j < land[keyLands[i]].length; j++) {
      var toDetail = document.createElement("a");
      var table = document.createElement("table");
      table.className += "activities-browser table";
      var arr = land[keyLands[i]];
      var obj = arr[j];
      toDetail.href = "activitydetails.html#" + obj.activity_id;
      var fullDate = obj.end_date != null ? obj.end_date : obj.start_date;
      var date = new Date(fullDate);
      date =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      var toDetails = document.createElement("a");
      toDetails.href = "activitydetails.html#" + obj.activity_id;

      var rowActivity = document.createElement("tr");

      switch (obj.status) {
        case "ยังไม่ทำ": {
          setBG = classColor.not_done;
          setText = classText.not_done;
          break;
        }
        case "กำลังดำเนินการ": {
          setBG = classColor.in_progress;
          setText = classText.in_progress;
          break;
        }
        case "เสร็จแล้ว": {
          setBG = classColor.done;
          setText = classText.done;
          break;
        }
        case "เลยกำหนด": {
          setBG = classColor.over_due;
          setText = classText.over_due;
          break;
        }
      }

      if (localStorage["role"] == '"owner"') {
        rowActivity.innerHTML = setActivityOwnerUI(
          obj.land_name,
          date,
          obj.task,
          obj.status,
          obj.activity_id
        );
        mobileCard =
        mobileCard +
        setactivityOwnerMobile(
          sortBy,
          obj.land_name,
          date,
          obj.task,
          obj.status,
          obj.activity_id,
          setText
        );
      } else {
        rowActivity.innerHTML = setActivityManagerUI(
          obj.land_name,
          date,
          obj.task,
          obj.status,
          obj.activity_id
        );
        mobileCard =
        mobileCard +
        setactivityManagerMobile(
          sortBy,
          obj.land_name,
          date,
          obj.task,
          obj.status,
          obj.activity_id,
          setText
        );
      }
      rowActivity.setAttribute("class", setBG);
      table.appendChild(rowActivity);
      toDetail.appendChild(table);
      responsiveTable.appendChild(toDetail);
    }
    cardBody.appendChild(responsiveTable);
    card.appendChild(cardBody);
    bodyContent.innerHTML = bodyContent.innerHTML + landHeader;
    timeline.appendChild(card);
    bodyContent.appendChild(timeline);
    bodyContent.innerHTML = bodyContent.innerHTML + mobileCard;
  }
}

function setActivityOwnerUI(landName, date, task, status, acID) {
  var ret =
    "<td>" +
    landName +
    "</td><td>" +
    date +
    "</td><td>" +
    task +
    "</td><td>" +
    status +
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
    acID +
    '">ความก้าวหน้า</a></li><li><a class="dropdown-item text-danger" href="#">ลบ</a></li></ul></td>';
  return ret;
}

function setActivityManagerUI(landName, date, task, status, acID) {
  var ret =
    "<td>" +
    landName +
    "</td><td>" +
    date +
    "</td><td>" +
    task +
    "</td><td>" +
    status +
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
    acID +
    '">ความก้าวหน้า</a></li></ul></td>';
  return ret;
}

function setactivityOwnerMobile(sort, landName, date, task, status, acID ,textColor) {
  var ret =
    '<div class="activities-mobile"><div class="timeline-item"><div class="timeline-body"><a class="'+textColor+'" href="activitydetails.html#' +
    acID +
    '">';

  if (sort == "by-name") {
    var byName =
      '<table><tr><td width="100%">' +
      task +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
      acID +
      '">ความก้าวหน้า</a></li><li><a class="dropdown-item text-danger" href="#">ลบ</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
      status +
      '</small><small>&nbsp;&nbsp;<i class="fas fa-clock"></i>&nbsp;&nbsp;' +
      date +
      "</small></td></tr></table>";
    ret += byName;
  } else {
    var byDate =
      '<table><tr><td width="100%">' +
      task +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
      acID +
      '">ความก้าวหน้า</a></li><li><a class="dropdown-item text-danger" href="#">ลบ</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
      status +
      '</small><small>&nbsp;&nbsp;<i class="fas fa-seedling"></i>&nbsp;&nbsp;' +
      landName +
      "</small></td></tr></table>";
    ret += byDate;
  }
  ret += "</a></div></div></div>";

  return ret;
}

function setactivityManagerMobile(sort, landName, date, task, status, acID ,textColor) {
  var ret =
    '<div><div class="timeline-item"><div class="timeline-body"><a class="'+textColor+'" href="activitydetails.html#' +
    acID +
    '">';

  if (sort == "by-name") {
    var byName =
      '<table><tr><td width="100%">' +
      task +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
      acID +
      '">ความก้าวหน้า</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
      status +
      '</small><small>&nbsp;&nbsp;<i class="fas fa-clock"></i>&nbsp;&nbsp;' +
      date +
      "</small></td></tr></table>";
    ret += byName;
  } else {
    var byDate =
      '<table><tr><td width="100%">' +
      task +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
      acID +
      '">ความก้าวหน้า</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
      status +
      '</small><small>&nbsp;&nbsp;<i class="fas fa-seedling"></i>&nbsp;&nbsp;' +
      landName +
      "</small></td></tr></table>";
    ret += byDate;
  }
  ret += "</a></div></div></div>";

  return ret;
}