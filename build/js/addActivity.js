var activityName = document.getElementById("activityName");
var activityDate = document.getElementById("reservation");
var activityStatus = document.getElementById("activityStatus");
var additionNote = document.getElementById("additionNote");
var activityImage = document.getElementById("activityPicUpload");
var saveBtn = document.getElementById("saveBtn");
var cancelBtn = document.getElementById("cancelBtn");
var output = document.getElementById("result");
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

$(window, document).ready(function() {
  if (indexLand == 4) {
    window.location = "activities.html";
  }
  if (activityId) {
    updateProgressUI();
  }
});

$("#toIndexBtn").click(function() {
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

  // if (!collectedActivityName) {
  //   errorMessage.innerHTML = "*กรุณากรอกกิจกรรม";
  //   activityName.style.borderColor = "red";
  //   activityName.parentNode.appendChild(errorMessage);
  //   errorElement = errorMessage.parentNode.lastChild;
  //   pass = false;
  // } else {
  //   activityName.style.borderColor = "#CDCDCD";
  //   if (activityName.parentNode.lastChild != activityName) {
  //     activityName.parentNode.removeChild(activityName.parentNode.lastChild);
  //   }

  // }
  console.log(pass);
  return pass;
}

function emergencyAPI() {
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
  var postNewActivity = connectToServer(url, body, "POST");
  postNewActivity.then(
    docs => {
      console.log("create activity success " + docs);
      localStorage.removeItem("acByName");
    },
    function(e) {
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

function updateProgressAPI() {
  var url = "/activities/" + landId + "?activity=" + activityId;
  console.log("collectedActivityDate" , collectedActivityDate)
  var body = JSON.stringify({
    task: collectedActivityName,
    images: collectedActivityImage,
    end_date: collectedActivityDate,
    status: collectedActivityStatus,
    notes: collectedAdditionNote,
    manager_id: managerId
  });
  var postNewActivity = connectToServer(url, body, "POST");
  postNewActivity.then(
    docs => {
      localStorage.removeItem("acByName");
    },
    function(e) {
      localStorage.removeItem("acByName");
    }
  );
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
      emergencyAPI();
    }
  }
}

window.onload = function() {
  //Check File API support
  if (window.File && window.FileList && window.FileReader) {
    var filesInput = document.getElementById("activityPicUpload");

    filesInput.addEventListener("change", function(event) {
      var files = event.target.files; //FileList object
      for (var i = 0; i < files.length; i++) {
        file = files[i];

        //Only pics
        if (!file.type.match("image")) continue;

        var picReader = new FileReader();

        picReader.addEventListener("load", function(event) {
          var picFile = event.target;
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          var img = new Image();
          img.onload = function() {
            canvas.width = 500;
            canvas.height = canvas.width * (img.height / img.width);
            var controlSize = img.width >= 500 ? 1 : 1;
            // step 1 - resize to 50%
            var oc = document.createElement("canvas"),
              octx = oc.getContext("2d");
            oc.width = img.width * controlSize;
            oc.height = img.height * controlSize;
            octx.drawImage(img, 0, 0, oc.width, oc.height);
            // step 2
            octx.drawImage(
              oc,
              0,
              0,
              oc.width * controlSize,
              oc.height * controlSize
            );
            // step 3, resize to final size
            ctx.drawImage(
              oc,
              0,
              0,
              oc.width * controlSize,
              oc.height * controlSize,
              0,
              0,
              canvas.width,
              canvas.height
            );
            //img to file
            var filename = toImageFile(canvas.toDataURL(), null);
            outputImageUI(canvas.toDataURL(), filename);
          };
          img.src = picFile.result;
        });
        picReader.readAsDataURL(file);
      }
    });
  } else {
    console.log("Your browser does not support File API");
  }
};

$("#modalImage").click(function() {
  modal.style.display = "none";
});

//! Update progress
function updateProgressUI() {
  // sessionStorage.removeItem("landHeader");
  // sessionStorage.removeItem("updateActivity");
  var rightHeaderText = document.querySelectorAll("#rightHeaderText");
  var leftHeaderText = document.getElementById("leftHeaderText");
  var updateActivity = JSON.parse(sessionStorage.updateActivity);
  leftHeaderText.innerHTML = sessionStorage.landHeader;
  for (i in rightHeaderText) {
    rightHeaderText[i].innerHTML = "ความก้าวหน้า";
  }
  activityName.value = updateActivity.task;
  activityName.disabled = true;
  activityDate.value =
    updateActivity.end_date != null
      ? updateActivity.end_date
      : updateActivity.start_date;
  additionNote.value = updateActivity.notes;

  for (i in updateActivity.images) {
    var filename = updateActivity.images[i];
    outputImageUI(headerImage + filename, filename);
    toImageFile(headerImage + filename, filename);
  }
}

function toImageFile(canvas, filename) {
  var timestamp = Date.now();
  var filename = filename != null ? filename : timestamp + ".png";
  urltoFile(canvas, filename, "image/png").then(function(file) {
    console.log(file)
    pictureArray.push(file);
  });
  return filename;
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
  imageShow.onclick = function() {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  };

  // delete icon
  var deleteBt = document.createElement("img");
  deleteBt.setAttribute("class", "delete-img-btn");
  deleteBt.setAttribute("src", "build/img/close.png");
  deleteBt.onclick = (function(arg, index) {
    return function() {
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
  output.insertBefore(div, null);
}
