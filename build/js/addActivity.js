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
var collectedActivityImage

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
  
  postActivity();
}

function postActivity() {
  var url = "/activities/emergency/5dfce0619e009d0d4411728c" 
  var body = JSON.stringify({task: collectedActivityName,
              images: [],
              activity_type: "emergency",
              end_date: collectedActivityDate, 
              status: collectedActivityStatus, 
              note: collectedAdditionNote, 
              manager_id: managerId});
  var postNewActivity = connectToServer(url, body, "POST");
  postNewActivity.then(
    docs => {

      console.log("create activity success " + docs)
    },
    function(e) {
      // 404 owner not found
      console.log(managerId)
      console.log(collectedActivityName)
      console.log(collectedActivityDate)
      console.log(collectedActivityStatus)
      console.log(collectedAdditionNote)
      console.log(e.responseText);
    }
  );
}

function fileUpload() {

}
