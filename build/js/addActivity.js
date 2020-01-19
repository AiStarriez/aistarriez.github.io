var activityName = document.getElementById("activityName")
var activityDate = document.getElementById("reservation")
var activityStatus = document.getElementById("activityStatus")
var additionNote = document.getElementById("additionNote")
var activityImage = document.getElementById("activityPicUpload")
var saveBtn = document.getElementById("saveBtn")
var cancelBtn = document.getElementById("cancelBtn")

var collectedActivityName
var collectedActivityDate
var collectedActivityStatus
var collectedAdditionNote
var collectedActivityImage = []

function clearField() {
  activityName.value = ''
  activityDate.value = ''
  $("#activityStatus select").val("#doneStatus");
  additionNote.value = ''
  activityImage.value = ''
}
function getActivityInputValue() {
  collectedActivityName = activityName.value
  collectedActivityDate = activityDate.value
  collectedActivityStatus = activityStatus.value
  collectedAdditionNote = additionNote.value
  fileUpload();
}

function postActivity() {
  var url = "/activities/emergency/5dfce0619e009d0d4411728c"
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
      console.log("create activity success " + docs)
    },
    function (e) {
      // 404 owner not found
      console.log(managerId)
      console.log(collectedActivityName)
      console.log(collectedActivityDate)
      console.log(collectedActivityStatus)
      console.log(collectedAdditionNote)
      console.log(collectedActivityImage)
      console.log(e.responseText);
    }
  );
}


var uploadCount = 0
function fileUpload() {
  var timestamp = new Date().toISOString();
  timestamp = timestamp.substr(0, 19)
  timestamp = timestamp.replace(/:/g, "-")

  if (uploadCount < pictureArray.length) {
    var url = "/aws/image?m=" + timestamp + "&o=" + ownerId + "&e=activity";
    var formdata = new FormData();
    formdata.append("busboy", pictureArray[uploadCount]);
    var typ = "POST";
    var uploadImageAWS = uploadToAWS(url, formdata, typ);
    uploadImageAWS.then(
      docs => {
        uploadCount++;
        console.log(docs)
        collectedActivityImage.push(docs)
        fileUpload();
       
      },
      err => {
        console.log(err);
      }
    );
  } else {
    postActivity();
    console.log("Files upload successful.")
  }
}

var pictureArray = []
window.onload = function () {

  //Check File API support
  if (window.File && window.FileList && window.FileReader) {
    var filesInput = document.getElementById("activityPicUpload");

    filesInput.addEventListener("change", function (event) {

      var files = event.target.files; //FileList object
      var output = document.getElementById("result");

      for (var i = 0; i < files.length; i++) {
        file = files[i];

        //Only pics
        if (!file.type.match('image'))
          continue;

        var picReader = new FileReader();

        picReader.addEventListener("load", function (event) {

          var picFile = event.target;

          var div = document.createElement("div");

          div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" +
            "title='" + picFile.name + "'/>";
          var timestamp = new Date().toISOString();
          timestamp = timestamp.substr(0, 19)
          timestamp = timestamp.replace(/:/g, "-")
          urltoFile(picFile.result, (timestamp + ".png"), "image/png").then(function (file) {
            pictureArray.push(file);
          });

          output.insertBefore(div, null);

        });

        //Read the image
        picReader.readAsDataURL(file);

      }

    });
  }
  else {
    console.log("Your browser does not support File API");
  }
}

