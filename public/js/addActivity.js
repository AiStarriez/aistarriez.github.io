var activityName = document.getElementById("activityName");
var activityDate = document.getElementById("reservation");
var activityStatus = document.getElementById("activityStatus");
var additionNote = document.getElementById("additionNote");
var activityImage = document.getElementById("pictureInput");
var saveBtn = document.getElementById("saveBtn");
var cancelBtn = document.getElementById("cancelBtn");
var plantListContent = document.getElementById("result");
var modal = document.getElementById("modalImage");
var closeModalImage = document.getElementsByClassName("close")[0];
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var pictureArray = [];
var uploadCount = 0;
var url = window.location.toString();
var indexLand = url.indexOf("land=") + 5;
var indexAc = url.indexOf("activity=") + 9;
var landId = url.slice(indexLand, indexLand + 24);
var activityId = indexAc == 8 ? null : url.slice(indexAc, url.length);

var collectedActivityName;
var collectedActivityDate;
var collectedActivityStatus;
var collectedAdditionNote;
var collectedActivityImage = [];

$(window, document).ready(function () {
  if (indexLand == 4) {
    window.location = "activities.html";
  }
  if (activityId) {
    updateProgressUI();
  }
});

$("#toIndexBtn").click(function () {
  console.log("toIndexBtn clicked");
  window.location = "activitydetails.html#" + activityId + "&" + landId;
});

function clearField() {
  $("#modal-success").css("display", "block");
  activityName.value = "";
  activityDate.value = "";
  $("#activityStatus select").val("#doneStatus");
  additionNote.value = "";
  activityImage.value = "";
}

function postToDatabase() {
  var getDate = activityDate.value.split("/");
  getDate[2] = getDate[2] - 543;
  collectedActivityName = activityName.value;
  collectedActivityDate = new Date(`${getDate[2]}-${getDate[1]}-${getDate[0]}`)
  collectedActivityStatus = activityStatus.value;
  collectedAdditionNote = additionNote.value;
  var elementArray = [activityName, activityDate, activityStatus];
  var inputPass = checkValidityInput(elementArray);
  if (inputPass) {
    fileUpload();
  }
}

function checkValidityInput(elementArray) {
  var pass = true;
  for (i in elementArray) {
    var errorMessage = document.createElement("p");
    var br = document.createElement("br");
    errorMessage.style.color = "red";
    errorMessage.innerHTML = "*กรุณากรอกช่องนี้";
    if (!elementArray[i].value) {
      elementArray[i].style.borderColor = "red";
      elementArray[i].parentNode.appendChild(br);
      elementArray[i].parentNode.appendChild(errorMessage);
      pass = false;
    }
  }
  console.log(pass);
  return pass;
}

async function fileUpload() {
  if (uploadCount < pictureArray.length) {
    var url = "/images/upload?land=" + landId;
    var formdata = new FormData();
    formdata.append("file", pictureArray[uploadCount]);
    var typ = "POST";
    var uploadImage = uploadMongoImage(url, formdata, typ);
    uploadImage.then(
      docs => {
        uploadCount++;
        collectedActivityImage.push(docs);
        fileUpload();
      },
      err => {
        console.log(err);
      }
    );
  } else {
    console.log("Images upload successful.");
    if (activityId) {
      updateProgressAPI();
    } else {
      await emergencyAPI();
    }
  }
}

async function emergencyAPI() {
  try {
    localStorage.removeItem("by-name");
    localStorage.removeItem("lands");
    localStorage.removeItem("percent-lands");
    localStorage.removeItem("poly-lands-main")

    var url = "/activities/emergency/" + landId;
    var body = JSON.stringify({
      task: collectedActivityName,
      images: collectedActivityImage,
      activity_type: "emergency",
      end_date: collectedActivityDate,
      status: collectedActivityStatus,
      notes: collectedAdditionNote,
      manager_id: managerId
    });
    var postNewActivity = await connectToServer(url, body, "POST");
    window.location = "activities.html"
  } catch (err) {
    window.location = "activities.html"
  }

  postNewActivity.then(
    docs => {
      console.log("create activity success " + docs);

    },
    function (e) {
      // 404 owner not found
      console.log(managerId);
      console.log(collectedActivityName);
      console.log(collectedActivityDate);
      console.log(collectedActivityStatus);
      console.log(collectedAdditionNote);
      console.log(collectedActivityImage);
      console.log(e);
    }
  );
}

async function updateProgressAPI() {
  try {
    var url = "/activities/" + landId + "?activity=" + activityId;
    console.log("collectedActivityDate", collectedActivityDate)
    var body = JSON.stringify({
      task: collectedActivityName,
      images: collectedActivityImage,
      end_date: collectedActivityDate,
      status: collectedActivityStatus,
      notes: collectedAdditionNote,
      manager_id: managerId
    });

    var postNewActivity = await connectToServer(url, body, "POST");
    localStorage.removeItem("by-name");
    localStorage.removeItem("lands");
    localStorage.removeItem("percent-lands");
    localStorage.removeItem("poly-lands-main")
    window.location =
      "activitydetails.html?" + activityId + "&" + landId;
  } catch (err) {
    console.log(err);
    localStorage.removeItem("by-name");
    localStorage.removeItem("lands");
    localStorage.removeItem("percent-lands");
    localStorage.removeItem("poly-lands-main")
    window.location =
      "activitydetails.html?" + activityId + "&" + landId;
  }

}


//! Update progress
function updateProgressUI() {
  var rightHeaderText = document.querySelectorAll("#rightHeaderText");
  var leftHeaderText = document.getElementById("leftHeaderText");
  var updateActivity = JSON.parse(localStorage.updateActivity);
  leftHeaderText.innerHTML = localStorage.landHeader;
  for (i in rightHeaderText) {
    rightHeaderText[i].innerHTML = '&nbsp;&nbsp;<i class="fa fa-angle-right"></i>&nbsp;&nbsp;ความก้าวหน้า';
  }
  activityName.value = updateActivity.task;
  activityName.disabled = true;
  dbDate = updateActivity.end_date != null ?
    new Date(updateActivity.end_date) :
    new Date(updateActivity.start_date);
  activityDate.value = (`${dbDate.getDate()}/${dbDate.getMonth() + 1}/${dbDate.getFullYear()+543}`)

  additionNote.value = updateActivity.notes;
  for (i in updateActivity.images) {
    var filename = updateActivity.images[i];
    outputImageUI(headerImage + filename, filename);
    toImageFile(headerImage + filename, filename);
  }
}


function outputImageUI(canvas, filename) {
  var div = document.createElement("div");
  div.style.display = "inline-block";
  div.style.marginRight = "14px";
  div.style.marginBottom = "14px";
  var children = document.createElement("div");
  children.setAttribute("class", ".block");
  // canvas to img
  var imageShow = document.createElement("img");
  imageShow.setAttribute("class", "myImg");
  imageShow.setAttribute("src", canvas);
  imageShow.setAttribute("alt", filename);
  imageShow.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  };

  // delete icon
  var deleteBt = document.createElement("img");
  deleteBt.setAttribute("class", "delete-img-btn");
  deleteBt.setAttribute("src", "images/close.png");
  deleteBt.onclick = (function (arg, index) {
    return function () {
      console.log(index);
      for (i in pictureArray) {
        if (pictureArray[i].name == index) {
          pictureArray.splice(i, 1);
          break;
        }
      }
      arg.parentNode.removeChild(arg);
    };
  })(div, filename);

  children.appendChild(deleteBt);
  children.appendChild(imageShow);
  div.appendChild(children);
  plantListContent.insertBefore(div, null);
}