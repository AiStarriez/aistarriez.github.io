$(window, document).ready(function() {
  window.sortBy = "by-name";
  apiGetactivities(window.sortBy);
});

var filterByname = document.getElementById("by-name");
var filterBydate = document.getElementById("by-date");
var landNameArr = [];
var activities;
sessionStorage.removeItem("landEmergency");

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
  var setBG, setText;
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
  var landIdArr = [];

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
        landIdArr.push(docs[count - 1].land_id);
        activityArr = [];
        activityArr.push(docs[count]);
      }
      if (count == docs.length - 1) {
        var obj = {};
        obj[docs[count - 1].land_name] = activityArr;
        acByName.push(obj);
        keyLands.push(docs[count - 1].land_name);
        landIdArr.push(docs[count - 1].land_id);
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
     (toDate.getFullYear()+543);
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
        (toDate.getFullYear()+543);

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
    landNameArr.push({ name: keyLands[i], id: landIdArr[i] });
    var landHeader =
      '<div class="time-label"><span class="bg-blue">' +
      keyLands[i] +
      "</span></div>";
    var timeline = document.createElement("div");
    var land = newObj[i];
    var card = document.createElement("div");
    var blank = "<tr><td></td><td></td><td></td><td></td><td></td></tr>";
    card.setAttribute("class", "activities-browser timeline-item");

    var mobileCard = "";
    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "timeline-body");
    var responsiveTable = document.createElement("div");
    responsiveTable.className = "card-body table-responsive p-0";
    var toDetail = document.createElement("a");
    var table = document.createElement("table");
    table.className += "activities-browser table";
    toDetail.href = "activitydetails.html#" + obj.activity_id;

    for (let j = 0; j < land[keyLands[i]].length; j++) {
      var arr = land[keyLands[i]];
      var obj = arr[j];

      var fullDate = obj.end_date != null ? obj.end_date : obj.start_date;
      var date = new Date(fullDate);
      date =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear()+543);
      var toDetails = document.createElement("a");
      toDetails.href = "activitydetails.html#" + obj.activity_id;

      var rowActivity = "";

      switch (obj.status) {
        case "ยังไม่ทำ": {
          setBG = classColor.not_done;
          setText = classText.not_done;
          break;
        }
        case "ยังไม่เสร็จ": {
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
       
        rowActivity += setActivityOwnerUI(
          obj.land_name,
          date,
          obj.task,
          obj.status,
          (obj.activity_id + "&" + obj.land_id),
          setBG
        );
        mobileCard =
          mobileCard +
          setactivityOwnerMobile(
            sortBy,
            obj.land_name,
            date,
            obj.task,
            obj.status,
            (obj.activity_id + "&" + obj.land_id),
            setText
          );
      } else {
        rowActivity += setActivityManagerUI(
          obj.land_name,
          date,
          obj.task,
          obj.status,
          (obj.activity_id + "&" + obj.land_id),
          setBG
        );
        mobileCard =
          mobileCard +
          setactivityManagerMobile(
            sortBy,
            obj.land_name,
            date,
            obj.task,
            obj.status,
            (obj.activity_id + "&" + obj.land_id),
            setText
          );
      }
      // rowActivity.setAttribute("class", setBG);
      if (j != 0) {
        table.innerHTML = table.innerHTML + blank;
      }
      table.innerHTML = table.innerHTML + rowActivity;
    }
    //toDetail.appendChild(table);
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
  var landNameDropdown = document.getElementById("land-dropdown");
  var landNameFilter = document.getElementById("land-name-filter");
  for (let i = 0; i < landNameArr.length; i++) {
    var fName = document.createElement("a");
    fName.innerHTML = landNameArr[i].name;
    fName.setAttribute("class", "dropdown-item");
    fName.setAttribute("role", "presentation");
    landNameDropdown.appendChild(fName);
    fName.onclick = (function(arg) {
      return function() {
        $("#modal-error-text").css("display", "none");
        landNameFilter.innerHTML = arg.name;
        sessionStorage.landEmergency = arg.id;
      };
    })(landNameArr[i]);
  }
}

$("#emer").click(function() {
  var landId = sessionStorage.landEmergency;
  if (landId) {
    window.location = "addActivity.html#" + landId;
  } else {
    $("#modal-error-text").css("display", "block");
  }
});

// check modal visibility
var $div = $("#modal-add-activity");
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.attributeName === "class") {
      var attributeValue = $(mutation.target).prop(mutation.attributeName);
      if(!attributeValue.includes('show')){
        sessionStorage.removeItem("landEmergency");
      } 
    }
  });
});

observer.observe($div[0], {
  attributes: true
});
// check modal visibility